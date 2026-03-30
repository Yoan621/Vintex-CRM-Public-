import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminSession(request)
  return NextResponse.json({ isAdmin })
}
