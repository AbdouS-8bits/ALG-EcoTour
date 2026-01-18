import { prisma } from './prisma';

export interface UserSettings {
  id: number;
  userId: number;
  language: string;
  emailNotifications: boolean;
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSettingsData {
  language?: string;
  emailNotifications?: boolean;
  darkMode?: boolean;
}

/**
 * Get user settings by user ID
 */
export async function getUserSettings(userId: number): Promise<UserSettings | null> {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId,
          language: 'ar',
          emailNotifications: true,
          darkMode: false,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw new Error('Failed to fetch user settings');
  }
}

/**
 * Get user settings by email
 */
export async function getUserSettingsByEmail(email: string): Promise<UserSettings | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await getUserSettings(user.id);
  } catch (error) {
    console.error('Error fetching user settings by email:', error);
    throw new Error('Failed to fetch user settings');
  }
}

/**
 * Update user settings
 */
export async function updateUserSettings(userId: number, data: UpdateSettingsData): Promise<UserSettings> {
  try {
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: {
        userId,
        language: data.language || 'ar',
        emailNotifications: data.emailNotifications ?? true,
        darkMode: data.darkMode ?? false,
      },
    });

    return settings;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Failed to update user settings');
  }
}

/**
 * Update user settings by email
 */
export async function updateUserSettingsByEmail(email: string, data: UpdateSettingsData): Promise<UserSettings> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await updateUserSettings(user.id, data);
  } catch (error) {
    console.error('Error updating user settings by email:', error);
    throw new Error('Failed to update user settings');
  }
}

/**
 * Delete user settings
 */
export async function deleteUserSettings(userId: number): Promise<void> {
  try {
    await prisma.userSettings.delete({
      where: { userId },
    });
  } catch (error) {
    console.error('Error deleting user settings:', error);
    throw new Error('Failed to delete user settings');
  }
}
