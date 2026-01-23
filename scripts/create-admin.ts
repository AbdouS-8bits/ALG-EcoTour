import { query } from '../lib/db';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  try {
    const email = 'admin@ecotour.dz';
    const password = 'admin123'; // Change this!
    const name = 'Admin User';

    // Check if user already exists
    const existing = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      console.log('❌ Admin user already exists with email:', email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const result = await query(
      `INSERT INTO users (email, name, password, role, "emailVerified")
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, name, role`,
      [email, name, hashedPassword, 'admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('⚠️  Please change the password after first login!');
    console.log('\nUser details:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
