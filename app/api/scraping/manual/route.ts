import { NextResponse } from 'next/server'
import { syncVintedStock } from '@/lib/services/vintedScraper'

/**
 * API Route pour scraping manuel Vinted
 * POST /api/scraping/manual
 *
 * Body: {
 *   profileUrl: string
 *   testMode?: boolean  // Si true, scrape seulement 2 articles pour tester
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { profileUrl, testMode = false } = body

    // Validation
    if (!profileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL du profil Vinted requise'
        },
        { status: 400 }
      )
    }

    // Vérifier que c'est bien une URL Vinted
    if (!profileUrl.includes('vinted.fr/member/')) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL invalide. Format attendu: https://www.vinted.fr/member/XXXXX'
        },
        { status: 400 }
      )
    }

    console.log(`🔄 Début du scraping ${testMode ? '(MODE TEST)' : ''}...`)
    console.log(`📍 Profil: ${profileUrl}`)

    // Lancer le scraping
    const result = await syncVintedStock(profileUrl, testMode)

    return NextResponse.json({
      success: true,
      message: testMode
        ? `✅ Test terminé : ${result.nouveaux} nouveaux, ${result.modifies} modifiés`
        : `✅ Sync terminée : ${result.nouveaux} nouveaux, ${result.modifies} modifiés, ${result.supprimes} supprimés`,
      data: {
        nouveaux: result.nouveaux,
        modifies: result.modifies,
        supprimes: result.supprimes,
        total: result.total,
        duree: result.duree
      }
    })

  } catch (error) {
    console.error('❌ Erreur API scraping:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors du scraping',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/scraping/manual
 * Retourne les informations sur l'API
 */
export async function GET() {
  return NextResponse.json({
    name: 'Vinted Scraper API',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Lance un scraping manuel du profil Vinted',
        body: {
          profileUrl: 'https://www.vinted.fr/member/178767503',
          testMode: false
        }
      }
    }
  })
}
