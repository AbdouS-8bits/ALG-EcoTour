import { query } from '../lib/db';

async function createTestUser() {
  try {
    // Check if test user exists
    const existing = await query(
      'SELECT id FROM users WHERE email = $1',
      ['test@ecotour.dz']
    );

    if (existing.rows.length > 0) {
      console.log('✅ Test user already exists');
      
      // Update to mark email as verified
      await query(
        `UPDATE users 
         SET "emailVerified" = NOW() 
         WHERE email = $1`,
        ['test@ecotour.dz']
      );
      
      console.log('✅ Test user email marked as verified');
      return;
    }

    // Create test user with verified email
    const result = await query(
      `INSERT INTO users (email, name, password, role, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW(), NOW())
       RETURNING id, email, name`,
      [
        'test@ecotour.dz',
        'Test User',
        '$2b$10$dummy', // Dummy password hash
        'user'
      ]
    );

    console.log('✅ Test user created:', result.rows[0]);
    console.log('Email: test@ecotour.dz');
    console.log('This user has a verified email and can receive campaign emails (if SMTP is configured)');
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

createTestUser();
