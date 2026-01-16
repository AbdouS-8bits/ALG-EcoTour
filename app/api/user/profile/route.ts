import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { getUserProfile, updateUserProfile } from '@/lib/user';

// Zod schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  phone: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format').optional().or(z.literal('')),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userProfile = await getUserProfile(session.user.email);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, phone } = validation.data;

    // Check if user exists
    const existingUser = await getUserProfile(session.user.email);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    const updatedProfile = await updateUserProfile(session.user.email, {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone: phone || null }),
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile', details: (error as Error).message },
      { status: 500 }
    );
  }
}
