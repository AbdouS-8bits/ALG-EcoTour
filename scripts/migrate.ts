import { query } from '../lib/db';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    // Create migrations tracking table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found. Creating one...');
      fs.mkdirSync(migrationsDir, { recursive: true });
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      // Check if migration has already been run
      const result = await query(
        'SELECT id FROM migrations WHERE filename = $1',
        [file]
      );

      if (result.rows.length > 0) {
        console.log(`✓ Migration ${file} already executed, skipping...`);
        continue;
      }

      console.log(`Running migration: ${file}`);
      
      // Read and execute migration file
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await query(sql);
      
      // Record migration as executed
      await query(
        'INSERT INTO migrations (filename) VALUES ($1)',
        [file]
      );
      
      console.log(`✓ Migration ${file} completed successfully`);
    }

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
