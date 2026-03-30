import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { withAuthAndRateLimit } from '@/lib/auth/extension-auth'
import { validateBoosts, formatZodError } from '@/lib/validation/sync-validators'
import { z } from 'zod'

/**
 * POST /api/sync/boosts
 * Synchronise les boosts depuis l'extension Chrome
 */
export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(request, async (req) => {
    const startTime = Date.now()

    try {
      const body = await req.json()

      // Valider les données
      let boosts
      try {
        boosts = validateBoosts(body.boosts)
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

      for (const boostData of boosts) {
        try {
          // Chercher par article + date (pas d'ID unique de transaction pour les boosts)
          const existing = await prisma.boost.findFirst({
            where: {
              article: boostData.article,
              date: boostData.date
            }
          })

          if (existing) {
            // Détecter les changements
            const hasChanges =
              existing.status !== boostData.status ||
              existing.dateExpiration?.getTime() !== boostData.dateExpiration?.getTime()

            if (hasChanges) {
              await prisma.boost.update({
                where: { id: existing.id },
                data: {
                  ...boostData,
                  updatedAt: new Date(),
                  syncedAt: new Date(),
                  syncSource: 'extension'
                }
              })
              updated++
            }
          } else {
            // Créer un nouveau boost
            await prisma.boost.create({
              data: {
                ...boostData,
                syncSource: 'extension'
              }
            })
            created++
          }
        } catch (error) {
          console.error('Erreur traitement boost:', error)
          errors.push({
            article: boostData.article,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          })
        }
      }

      const durationSeconds = Math.round((Date.now() - startTime) / 1000)

      // Logger la synchronisation
      await prisma.syncLog.create({
        data: {
          syncType: 'boosts',
          status: errors.length === 0 ? 'success' : (boosts.length === errors.length ? 'error' : 'partial'),
          itemsProcessed: boosts.length,
          itemsCreated: created,
          itemsUpdated: updated,
          itemsErrors: errors.length,
          source: 'extension',
          durationSeconds,
          errorDetails: errors.length > 0 ? JSON.stringify(errors) : null,
          endTime: new Date()
        }
      })

      // Mettre à jour la date de dernière synchronisation
      const apiKey = request.headers.get('X-API-Key')
      if (apiKey) {
        await prisma.extensionConfig.updateMany({
          where: { apiKey },
          data: { lastSyncBoosts: new Date() }
        })
      }

      return NextResponse.json({
        success: true,
        created,
        updated,
        errors,
        durationSeconds
      })

    } catch (error) {
      console.error('Erreur API sync boosts:', error)

      await prisma.syncLog.create({
        data: {
          syncType: 'boosts',
          status: 'error',
          itemsProcessed: 0,
          source: 'extension',
          errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
          durationSeconds: Math.round((Date.now() - startTime) / 1000),
          endTime: new Date()
        }
      })

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
