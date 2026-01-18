import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    console.log('📝 Registration attempt:', email);

    // Validate
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user - emailVerified = false initially
    console.log('💾 Creating user in database...');
    const result = await query(
      `INSERT INTO users (
        email, 
        name, 
        password, 
        role, 
        "emailVerified",
        "verificationToken",
        "createdAt", 
        "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, email, name, role`,
      [email, name || null, hashedPassword, 'user', false, verificationToken]
    );

    const user = result.rows[0];
    console.log('✅ User created:', user.email);

    // Send verification email
    try {
      console.log('📧 Sending verification email...');
      await sendVerificationEmail(email, verificationToken);
      console.log('✅ Verification email sent successfully');
    } catch (emailError: any) {
      console.error('⚠️  Email sending failed:', emailError.message);
      // Don't fail registration, but inform user
      return NextResponse.json({
        success: true,
        message: 'Account created, but verification email failed to send. Please contact support.',
        email: user.email,
        emailSent: false,
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      email: user.email,
      emailSent: true,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Registration error:', error);
    console.error('Error details:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to create account',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
