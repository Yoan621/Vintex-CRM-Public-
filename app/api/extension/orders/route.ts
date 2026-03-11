import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// OPTIONS : preflight CORS pour l'extension navigateur
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

// POST : recevoir les commandes depuis l'extension
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orders: ordersData } = body

    if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
      return NextResponse.json(
        { error: 'Les données doivent contenir un array "orders" non vide' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // Upsert chaque commande (évite les doublons via transactionNumber unique)
    const results = await Promise.all(
      ordersData.map((order: {
        transactionNumber: string
        articleName: string
        brandName?: string
        vintedAccount: string
        status?: string
        saleDate: string | Date
        purchaseDate?: string | Date
        purchasePrice: number
        salePrice: number
        customerName: string
        trackingNumber?: string
        carrier?: string
      }) =>
        prisma.vente.upsert({
          where: { transactionNumber: order.transactionNumber },
          update: {
            status: order.status ?? 'non_traite',
            salePrice: order.salePrice,
            customerName: order.customerName,
          },
          create: {
            transactionNumber: order.transactionNumber,
            articleName: order.articleName,
            brandName: order.brandName,
            vintedAccount: order.vintedAccount,
            status: order.status ?? 'non_traite',
            saleDate: new Date(order.saleDate),
            purchaseDate: order.purchaseDate ? new Date(order.purchaseDate) : null,
            purchasePrice: order.purchasePrice,
            salePrice: order.salePrice,
            customerName: order.customerName,
            trackingNumber: order.trackingNumber,
            carrier: order.carrier,
          },
        })
      )
    )

    return NextResponse.json(
      {
        success: true,
        message: `✅ ${results.length} commande(s) reçue(s) et stockée(s)`,
        count: results.length,
      },
      { status: 201, headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('❌ Erreur lors de la réception des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde', details: error instanceof Error ? error.message : 'Erreur inconnue' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

// GET : récupérer les commandes depuis la DB
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const account = searchParams.get('account')

    const ventes = await prisma.vente.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(account ? { vintedAccount: account } : {}),
      },
      orderBy: { saleDate: 'desc' },
    })

    // Convertir au format attendu par le frontend
    const orders = ventes.map(v => ({
      id: v.id,
      transactionNumber: v.transactionNumber,
      articleName: v.articleName,
      brandName: v.brandName,
      vintedAccount: v.vintedAccount,
      status: v.status,
      saleDate: v.saleDate,
      purchaseDate: v.purchaseDate,
      purchasePrice: v.purchasePrice,
      salePrice: v.salePrice,
      customerName: v.customerName,
      trackingNumber: v.trackingNumber,
      carrier: v.carrier,
    }))

    return NextResponse.json(
      { success: true, count: orders.length, orders },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
