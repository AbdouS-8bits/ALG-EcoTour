import { prisma } from './prisma';

/**
 * Execute a raw SQL query using Prisma's raw query capability
 * @param sql - The SQL query string
 * @param values - Optional parameter values for the query
 * @returns Promise with query results
 */
export async function query(sql: string, values: any[] = []) {
  try {
    const result = await prisma.$queryRawUnsafe(sql, ...values);
    return {
      rows: result,
      rowCount: Array.isArray(result) ? result.length : 0,
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default query;
