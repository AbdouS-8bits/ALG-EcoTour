import { testConnection } from '../lib/db';

async function checkDatabase() {
  console.log('🔍 Checking Database Configuration...\n');
  
  console.log('Environment Variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
  console.log('Value:', process.env.DATABASE_URL);
  console.log();

  console.log('Testing Connection...');
  await testConnection();
  
  process.exit(0);
}

checkDatabase();
