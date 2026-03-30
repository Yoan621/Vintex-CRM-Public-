import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { withAuthAndRateLimit } from '@/lib/auth/extension-auth'
import { validateArticles, formatZodError } from '@/lib/validation/sync-validators'
import { z } from 'zod'

/**
 * POST /api/sync/articles
 * Synchronise les articles en vente depuis l'extension Chrome
 */
export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(request, async (req) => {
    const startTime = Date.now()

    try {
      const body = await req.json()

      // Valider les données
      let articles
      try {
        articles = validateArticles(body.articles)
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
      let deleted = 0
      const errors: any[] = []

      // IDs des articles synchronisés (pour détecter les suppressions)
      const syncedVintedIds = articles.map(a => a.vintedId)

      for (const articleData of articles) {
        try {
          const existing = await prisma.article.findUnique({
            where: { vintedId: articleData.vintedId }
          })

          if (existing) {
            // Détecter les changements
            const hasChanges =
              existing.prix !== articleData.prix ||
              existing.nom !== articleData.nom ||
              existing.statut !== articleData.statut ||
              existing.nombreVues !== articleData.nombreVues ||
              existing.nombreLikes !== articleData.nombreLikes

            if (hasChanges) {
              await prisma.article.update({
                where: { id: existing.id },
                data: {
                  ...articleData,
                  dateMiseAJour: new Date(),
                  derniereSync: new Date()
                }
              })
              updated++
            }
          } else {
            // Créer un nouvel article
            await prisma.article.create({
              data: {
                ...articleData,
                dateAjout: new Date(),
                dateMiseAJour: new Date(),
                derniereSync: new Date()
              }
            })
            created++
          }
        } catch (error) {
          console.error('Erreur traitement article:', error)
          errors.push({
            vintedId: articleData.vintedId,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
          })
        }
      }

      // Marquer les articles supprimés (non présents dans la synchro)
      const deletedResult = await prisma.article.updateMany({
        where: {
          vintedId: { notIn: syncedVintedIds },
          estActif: true
        },
        data: {
          estActif: false,
          statut: 'vendu',
          derniereSync: new Date()
        }
      })

      deleted = deletedResult.count

      const durationSeconds = Math.round((Date.now() - startTime) / 1000)

      // Logger la synchronisation
      await prisma.syncLog.create({
        data: {
          syncType: 'articles',
          status: errors.length === 0 ? 'success' : (articles.length === errors.length ? 'error' : 'partial'),
          itemsProcessed: articles.length,
          itemsCreated: created,
          itemsUpdated: updated,
          itemsDeleted: deleted,
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
          data: { lastSyncArticles: new Date() }
        })
      }

      return NextResponse.json({
        success: true,
        created,
        updated,
        deleted,
        errors,
        durationSeconds
      })

    } catch (error) {
      console.error('Erreur API sync articles:', error)

      await prisma.syncLog.create({
        data: {
          syncType: 'articles',
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
