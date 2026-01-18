import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Execute a raw SQL query
 * @param sql - The SQL query string
 * @param values - Optional parameter values for the query
 * @returns Promise with query results
 */
export async function query(sql: string, values: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default query;
