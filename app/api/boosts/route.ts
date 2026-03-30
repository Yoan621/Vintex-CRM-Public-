import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/boosts
 * Récupère tous les boosts
 */
export async function GET() {
  try {
    const boosts = await prisma.boost.findMany({
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({
      success: true,
      boosts,
      total: boosts.length
    })
  } catch (error) {
    console.error('Erreur API boosts:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
