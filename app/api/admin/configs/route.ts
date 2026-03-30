import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { verifyAdminSession, unauthorizedResponse } from '@/lib/auth/admin-auth'
import { randomBytes } from 'crypto'

// GET /api/admin/configs — liste tous les ExtensionConfig
export async function GET(request: NextRequest) {
  if (!await verifyAdminSession(request)) return unauthorizedResponse()

  const configs = await prisma.extensionConfig.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      vintedAccount: true,
      apiKey: true,
      isActive: true,
      lastSyncVentes: true,
      lastSyncAchats: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  return NextResponse.json({ configs })
}

// POST /api/admin/configs — crée une nouvelle clé API
export async function POST(request: NextRequest) {
  if (!await verifyAdminSession(request)) return unauthorizedResponse()

  const { vintedAccount } = await request.json()

  if (!vintedAccount?.trim()) {
    return NextResponse.json({ error: 'Compte Vinted requis' }, { status: 400 })
  }

  const apiKey = randomBytes(32).toString('hex')

  const config = await prisma.extensionConfig.create({
    data: {
      apiKey,
      vintedAccount: vintedAccount.trim(),
      isActive: true,
    },
    select: {
      id: true,
      vintedAccount: true,
      apiKey: true,
      isActive: true,
      createdAt: true,
    }
  })

  return NextResponse.json({ config }, { status: 201 })
}
