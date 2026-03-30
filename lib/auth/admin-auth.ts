import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'vintex_admin_session'

export async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) return false

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
}
