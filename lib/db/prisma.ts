import { PrismaClient } from '@prisma/client'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaLibSql } = require('@prisma/adapter-libsql')

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL ||
    `file://${path.join(process.cwd(), 'prisma', 'dev.db')}`

  console.log('[Prisma] Connexion DB:', dbUrl)

  // Prisma 7 : passer la config directement, pas un client pré-créé
  const adapter = new PrismaLibSql({ url: dbUrl })

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
