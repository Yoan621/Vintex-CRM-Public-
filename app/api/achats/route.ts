import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

/**
 * GET /api/achats
 * Récupère tous les achats
 */
export async function GET() {
  try {
    const achats = await prisma.achat.findMany({
      orderBy: { dateAchat: 'desc' }
    })

    return NextResponse.json({
      success: true,
      achats,
      total: achats.length
    })
  } catch (error) {
    console.error('Erreur API achats:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
