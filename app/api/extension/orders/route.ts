import {
  addOrders,
  getOrders,
  getOrdersStats,
  getOrdersByStatus,
  getOrdersByAccount,
  getOrdersByPeriod
} from '@/lib/store/ordersStore'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API pour recevoir et récupérer les commandes depuis l'extension navigateur
 * POST /api/extension/orders : ajouter des commandes
 * GET /api/extension/orders : récupérer les commandes
 */

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

    // Validation
    if (!ordersData || !Array.isArray(ordersData)) {
      return NextResponse.json(
        { error: 'Les données doivent contenir un array "orders"' },
        { status: 400 }
      )
    }

    if (ordersData.length === 0) {
      return NextResponse.json(
        { error: 'Aucune commande à ajouter' },
        { status: 400 }
      )
    }

    // Ajouter les commandes au store
    const added = addOrders(ordersData)

    return NextResponse.json(
      {
        success: true,
        message: `✅ ${added.length} commande(s) reçue(s) et stockée(s)`,
        count: added.length,
        orders: added
      },
      { status: 201, headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('❌ Erreur lors de la réception des commandes:', error)
    return NextResponse.json(
      {
        error: 'Erreur lors de la sauvegarde des commandes',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

// GET : récupérer les commandes avec filtres optionnels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'non_traite' | 'validee' | 'annulee' | null
    const account = searchParams.get('account') as string | null
    const stats = searchParams.get('stats') === 'true'
    const period = searchParams.get('period') as string | null

    let result = getOrders()

    // Filtrer par statut
    if (status) {
      result = result.filter(o => o.status === status)
    }

    // Filtrer par compte
    if (account) {
      result = result.filter(o => o.vintedAccount === account)
    }

    // Filtrer par période (format: startDate,endDate)
    if (period) {
      const [startStr, endStr] = period.split(',')
      if (startStr && endStr) {
        const startDate = new Date(startStr)
        const endDate = new Date(endStr)
        result = getOrdersByPeriod(startDate, endDate)
      }
    }

    // Ajouter les stats si demandé
    if (stats) {
      return NextResponse.json({
        success: true,
        count: result.length,
        stats: getOrdersStats(),
        orders: result
      }, { headers: CORS_HEADERS })
    }

    return NextResponse.json({
      success: true,
      count: result.length,
      orders: result
    }, { headers: CORS_HEADERS })
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}

/**
 * Exemples d'utilisation:
 * 
 * POST /api/extension/orders
 * {
 *   "orders": [
 *     {
 *       "transactionNumber": "#VT-2025-001",
 *       "articleName": "Jordan 1 Retro High",
 *       "brandName": "Nike",
 *       "vintedAccount": "@vintex_shop",
 *       "status": "non_traite",
 *       "saleDate": "2025-12-22T00:00:00Z",
 *       "purchasePrice": 95,
 *       "salePrice": 180,
 *       "customerName": "Alexandre Petit"
 *     }
 *   ]
 * }
 *
 * GET /api/extension/orders
 * GET /api/extension/orders?status=non_traite
 * GET /api/extension/orders?account=@vintex_shop
 * GET /api/extension/orders?stats=true
 * GET /api/extension/orders?period=2025-01-01,2025-01-31
 */
