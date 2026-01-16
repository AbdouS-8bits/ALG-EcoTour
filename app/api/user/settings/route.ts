import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { getUserSettingsByEmail, updateUserSettingsByEmail } from '@/lib/settings';

// Zod schema for settings update
const updateSettingsSchema = z.object({
  language: z.enum(['ar', 'fr', 'en']).optional(),
  emailNotifications: z.boolean().optional(),
  darkMode: z.boolean().optional(),
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

    const userSettings = await getUserSettingsByEmail(session.user.email);

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings', details: (error as Error).message },
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
    const validation = updateSettingsSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { language, emailNotifications, darkMode } = validation.data;

    // Update user settings
    const updatedSettings = await updateUserSettingsByEmail(session.user.email, {
      ...(language !== undefined && { language }),
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(darkMode !== undefined && { darkMode }),
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Update user settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings', details: (error as Error).message },
      { status: 500 }
    );
  }
}
