import { Pool } from 'pg';

// Parse DATABASE_URL or use individual components
const connectionString = process.env.DATABASE_URL;

// Create a connection pool with explicit configuration
const pool = new Pool({
  connectionString,
  // Fallback to individual components if URL parsing fails
  ...((!connectionString || connectionString.includes('undefined')) && {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecotour_db',
  }),
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
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

/**
 * Test database connection
 */
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export default query;
