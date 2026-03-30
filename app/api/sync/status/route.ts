import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { withExtensionAuth } from '@/lib/auth/extension-auth'

/**
 * GET /api/sync/status
 * Retourne l'état de la synchronisation
 */
export async function GET(request: NextRequest) {
  return withExtensionAuth(request, async (req) => {
    try {
      const apiKey = request.headers.get('X-API-Key')

      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key manquante' },
          { status: 400 }
        )
      }

      // Récupérer la configuration de l'extension
      const config = await prisma.extensionConfig.findUnique({
        where: { apiKey }
      })

      if (!config) {
        return NextResponse.json(
          { error: 'Configuration non trouvée' },
          { status: 404 }
        )
      }

      // Récupérer les logs récents
      const recentLogs = await prisma.syncLog.findMany({
        where: { source: 'extension' },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      // Récupérer les statistiques
      const stats = {
        ventes: await prisma.vente.count(),
        achats: await prisma.achat.count(),
        boosts: await prisma.boost.count(),
        articles: await prisma.article.count({ where: { estActif: true } })
      }

      // Calculer la prochaine synchronisation
      const lastSync = [
        config.lastSyncVentes,
        config.lastSyncAchats,
        config.lastSyncBoosts,
        config.lastSyncArticles
      ]
        .filter(d => d !== null)
        .sort((a, b) => (b?.getTime() || 0) - (a?.getTime() || 0))[0]

      const nextSync = lastSync
        ? new Date(lastSync.getTime() + config.syncInterval * 60 * 1000)
        : null

      // Déterminer le statut
      let status: 'idle' | 'syncing' | 'error' = 'idle'

      const lastLog = recentLogs[0]
      if (lastLog) {
        if (lastLog.status === 'error') {
          status = 'error'
        } else if (lastLog.endTime === null) {
          status = 'syncing'
        }
      }

      return NextResponse.json({
        status,
        config: {
          syncInterval: config.syncInterval,
          autoSync: config.autoSync,
          syncVentes: config.syncVentes,
          syncAchats: config.syncAchats,
          syncBoosts: config.syncBoosts,
          syncArticles: config.syncArticles
        },
        lastSync: {
          ventes: config.lastSyncVentes,
          achats: config.lastSyncAchats,
          boosts: config.lastSyncBoosts,
          articles: config.lastSyncArticles
        },
        nextSync,
        stats,
        recentLogs: recentLogs.map(log => ({
          id: log.id,
          syncType: log.syncType,
          status: log.status,
          itemsProcessed: log.itemsProcessed,
          itemsCreated: log.itemsCreated,
          itemsUpdated: log.itemsUpdated,
          itemsErrors: log.itemsErrors,
          durationSeconds: log.durationSeconds,
          createdAt: log.createdAt,
          errorMessage: log.errorMessage
        }))
      })

    } catch (error) {
      console.error('Erreur API sync status:', error)

      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        },
        { status: 500 }
      )
    }
  })
}
