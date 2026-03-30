import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/ventes
 * Récupère toutes les ventes
 */
export async function GET() {
  try {
    const ventes = await prisma.vente.findMany({
      orderBy: { saleDate: 'desc' }
    })

    return NextResponse.json({
      success: true,
      ventes,
      total: ventes.length
    })
  } catch (error) {
    console.error('Erreur API ventes:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
