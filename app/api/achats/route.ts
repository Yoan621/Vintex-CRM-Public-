import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/achats
export async function GET() {
  const achats = await prisma.achat.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Sérialiser les dates en string pour le frontend
  const serialized = achats.map(a => ({
    ...a,
    dateAchat: a.dateAchat.toISOString().split('T')[0],
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString()
  }))

  return NextResponse.json(serialized)
}

// POST /api/achats
export async function POST(request: NextRequest) {
  const data = await request.json()

  const achat = await prisma.achat.create({
    data: {
      numeroTransaction: data.numeroTransaction,
      nomArticle: data.nomArticle,
      marque: data.marque,
      taille: data.taille,
      prixAchat: data.prixAchat,
      fraisPort: data.fraisPort,
      coutTotal: data.prixAchat + data.fraisPort,
      dateAchat: new Date(data.dateAchat),
      plateforme: data.plateforme,
      vendeur: data.vendeur ?? null,
      compteVinted: data.compteVinted ?? null,
      statut: 'en_attente',
      numeroSuivi: data.numeroSuivi ?? null,
      prixReventePrevu: data.prixReventePrevu ?? null,
      margeEstimee: data.prixReventePrevu ? data.prixReventePrevu - (data.prixAchat + data.fraisPort) : null,
      notes: data.notes ?? null
    }
  })

  return NextResponse.json({
    ...achat,
    dateAchat: achat.dateAchat.toISOString().split('T')[0],
    createdAt: achat.createdAt.toISOString(),
    updatedAt: achat.updatedAt.toISOString()
  }, { status: 201 })
}
