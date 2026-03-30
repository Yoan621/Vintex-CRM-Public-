import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { withAuthAndRateLimit } from '@/lib/auth/extension-auth'
import { validateAchats, formatZodError } from '@/lib/validation/sync-validators'
import { z } from 'zod'

export async function OPTIONS(request: NextRequest) {
  return withAuthAndRateLimit(request, async () => new Response(null, { status: 204 }))
}

/**
 * POST /api/sync/achats
 * Synchronise les achats depuis l'extension Chrome
 */
export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(request, async (req) => {
    const startTime = Date.now()

    try {
      const body = await req.json()

      // Valider les données
      let achats
      try {
        achats = validateAchats(body.achats)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              success: false,
              error: 'Validation error',
              details: formatZodError(error)
            },
            { status: 400 }
          )
        }
        throw error
      }

      let created = 0
      let updated = 0
      const errors: any[] = []

      for (const achatData of achats) {
        try {
          const existing = await prisma.achat.findUnique({
            where: { numeroTransaction: achatData.numeroTransaction }
          })

          if (existing) {
            // Détecter les changements
            const hasChanges =
              existing.statut !== achatData.statut ||
              existing.numeroSuivi !== achatData.numeroSuivi ||
              existing.prixAchat !== achatData.prixAchat

            if (hasChanges) {
              await prisma.achat.update({
                where: { id: existing.id },
                data: {
                  ...achatData,
                  updatedAt: new Date(),
                  syncedAt: new Date(),
                  syncSource: 'extension'
                }
              })
              updated++
            }
          } else {
            // Créer un nouvel achat
            await prisma.achat.create({
              data: {
                ...achatData,
                margeEstimee: achatData.prixReventePrevu
                  ? achatData.prixReventePrevu - achatData.coutTotal
                  : 0,
                syncSource: 'extension'
              }
            })
            created++
          }
        } catch (error) {
          console.error('Erreur traitement achat:', error)
          errors.push({
            numeroTransaction: achatData.numeroTransaction,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          })
        }
      }

      const durationSeconds = Math.round((Date.now() - startTime) / 1000)

      // Logger la synchronisation (non-bloquant)
      prisma.syncLog.create({
        data: {
          syncType: 'achats',
          status: errors.length === 0 ? 'success' : (achats.length === errors.length ? 'error' : 'partial'),
          itemsProcessed: achats.length,
          itemsCreated: created,
          itemsUpdated: updated,
          itemsErrors: errors.length,
          source: 'extension',
          durationSeconds,
          errorDetails: errors.length > 0 ? JSON.stringify(errors) : null,
          endTime: new Date()
        }
      }).catch(e => console.warn('SyncLog write failed:', e.message))

      // Mettre à jour la date de dernière synchronisation (non-bloquant)
      const apiKey = request.headers.get('X-API-Key')
      if (apiKey) {
        prisma.extensionConfig.updateMany({
          where: { apiKey },
          data: { lastSyncAchats: new Date() }
        }).catch(e => console.warn('ExtensionConfig update failed:', e.message))
      }

      return NextResponse.json({
        success: true,
        created,
        updated,
        errors,
        durationSeconds
      })

    } catch (error) {
      console.error('Erreur API sync achats:', error)

      // Logger l'erreur (non-bloquant)
      prisma.syncLog.create({
        data: {
          syncType: 'achats',
          status: 'error',
          itemsProcessed: 0,
          source: 'extension',
          errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
          durationSeconds: Math.round((Date.now() - startTime) / 1000),
          endTime: new Date()
        }
      }).catch(e => console.warn('SyncLog error write failed:', e.message))

      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        },
        { status: 500 }
      )
    }
  })
}
