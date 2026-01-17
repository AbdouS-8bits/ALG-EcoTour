import { prisma } from './prisma';

export interface UserProfile {
  id: number;
  email: string;
  name?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  name?: string;
}

/**
 * Get user profile by email
 */
export async function getUserProfile(email: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(email: string, data: UpdateProfileData): Promise<UserProfile> {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        ...(data.name !== undefined && { name: data.name }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfileById(id: number): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Update user profile by ID
 */
export async function updateUserProfileById(id: number, data: UpdateProfileData): Promise<UserProfile> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error updating user profile by ID:', error);
    throw new Error('Failed to update user profile');
  }
}
