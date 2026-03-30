import { NextResponse } from 'next/server'
import path from 'path'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || `file://${path.join(process.cwd(), 'prisma', 'dev.db')}`
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL,
    cwd: process.cwd(),
    computed_url: dbUrl,
    NODE_ENV: process.env.NODE_ENV,
  })
}
