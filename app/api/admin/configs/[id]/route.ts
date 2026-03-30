import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { verifyAdminSession, unauthorizedResponse } from '@/lib/auth/admin-auth'

// DELETE /api/admin/configs/[id] — révoque une clé (isActive = false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await verifyAdminSession(request)) return unauthorizedResponse()

  const config = await prisma.extensionConfig.update({
    where: { id: params.id },
    data: { isActive: false },
    select: { id: true, vintedAccount: true, isActive: true }
  })

  return NextResponse.json({ config })
}

// PATCH /api/admin/configs/[id] — réactive une clé
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await verifyAdminSession(request)) return unauthorizedResponse()

  const config = await prisma.extensionConfig.update({
    where: { id: params.id },
    data: { isActive: true },
    select: { id: true, vintedAccount: true, isActive: true }
  })

  return NextResponse.json({ config })
}
