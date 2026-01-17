import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Safe database connection with fallback
let pool: Pool | null = null
let adapter: PrismaPg | null = null
let prismaInstance: PrismaClient | null = null

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      // Add connection timeout and retry logic
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    })
    adapter = new PrismaPg(pool)
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    })
  } else {
    console.warn('⚠️ DATABASE_URL not configured - using fallback client')
    prismaInstance = new PrismaClient({
      log: ['error'],
    })
  }
} catch (error) {
  console.error('❌ Failed to initialize database connection:', error)
  // Create fallback client that will fail gracefully
  prismaInstance = new PrismaClient({
    log: ['error'],
  })
}

export const prisma = prismaInstance

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export connection status for health checks
export const dbConfigured = !!process.env.DATABASE_URL
export const dbPool = pool
