import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT /api/achats/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()

  const achat = await prisma.achat.update({
    where: { id: params.id },
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
  })
}

// DELETE /api/achats/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.achat.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

// PATCH /api/achats/[id] — mise à jour partielle (ex: statut)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const data = await request.json()

  const achat = await prisma.achat.update({
    where: { id: params.id },
    data
  })

  return NextResponse.json({
    ...achat,
    dateAchat: achat.dateAchat.toISOString().split('T')[0],
    createdAt: achat.createdAt.toISOString(),
    updatedAt: achat.updatedAt.toISOString()
  })
}
