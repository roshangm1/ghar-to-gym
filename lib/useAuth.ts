import { useState } from 'react';
import { db, id } from './instant';

// Wrapper around InstantDB's built-in magic code auth
// See: https://www.instantdb.com/docs/auth/magic-codes
export function useAuth() {
  const { isLoading, user } = db.useAuth();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const sendCode = async (email: string): Promise<void> => {
    let error: any;
    try {
      setPendingEmail(email);
      await db.auth.sendMagicCode({ email });
    } catch (err: any) {
      setPendingEmail(null);
      error = err;
    }
    
    // Extract value blocks outside try/catch for React Compiler
    if (error) {
      const errorMessage = error?.body?.message || 'Failed to send code';
      throw new Error(errorMessage);
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    if (!pendingEmail) {
      throw new Error('No pending email found');
    }

    let authUser;
    let error: any;
    try {
      await db.auth.signInWithMagicCode({
        email: pendingEmail,
        code,
      });

      // Wait a bit for auth to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get the authenticated user
      authUser = await db.getAuth();
    } catch (err: any) {
      error = err;
      console.error('Error verifying code:', error);
    }
    
    // Extract value blocks outside try/catch for React Compiler
    if (error) {
      const errorMessage = error?.body?.message || error?.message || 'Invalid code';
      throw new Error(errorMessage);
    }

    // Validate authUser outside of try/catch to avoid React Compiler issues
    if (!authUser) {
      throw new Error('Authentication failed');
    }

    // Use InstantDB's built-in $users table (created automatically on auth)
    // authUser.id is the userId from $users
    const authUserId = authUser.id;
    if (!authUser.email) {
      console.error('User email not found');
      return false;
    }
    const normalizedEmail = authUser.email.toLowerCase().trim();
    
    // First check by userId (most reliable)
    let existingUsersResponse = await db.queryOnce({
      users: {
        $: {
          where: { userId: authUserId },
        },
      },
    });
    let existingUsers = existingUsersResponse?.data?.users || [];
   
    // If not found by userId, check by email (fallback)
    if (existingUsers.length === 0) {
      console.log('🔍 User not found by userId, checking by email...');
      existingUsersResponse = await db.queryOnce({
        users: {
          $: {
            where: { email: normalizedEmail },
          },
        },
      });
      existingUsers = existingUsersResponse?.data?.users || [];
      console.log('📊 Query by email result:', {
        found: existingUsers.length,
        users: existingUsers.map((u: any) => ({ id: u.id, userId: u.userId, email: u.email })),
      });
    }

    if (existingUsers.length > 0) {
      // User exists - update userId if it's missing/mismatched, then return
      const existingUser = existingUsers[0];
      console.log('✅ User already exists:', existingUser.id);
      
      // If userId doesn't match, update it (shouldn't happen, but just in case)
      if (existingUser.userId !== authUserId) {
        console.log('⚠️ userId mismatch, updating...');
        await db.transact([
          db.tx.users[existingUser.id].update({
            userId: authUserId,
            email: normalizedEmail, // Also update email to be safe
            updatedAt: Date.now(),
          }),
        ]);
      }
      
      return true;
    }

    // User doesn't exist - create it (ONLY happens on first login)
    const userId = id();
    console.log('➕ Creating new user (first time login):', userId);
    await db.transact([
      db.tx.users[userId].update({
        userId: authUserId, // Reference to $users.id
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        workoutStreak: 0,
        totalWorkouts: 0,
        points: 0,
        customMetrics: {
          energyLevel: 7,
          sleepQuality: 8,
        },
        goals: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    ]);
    console.log('✅ Created new user:', userId);

    return true;
  };

  const logout = async () => {
    try {
      await db.auth.signOut();
      setPendingEmail(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    let authUser;
    try {
      authUser = await db.getAuth();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    // Extract value blocks outside try/catch for React Compiler
    if (!authUser || !authUser.email) {
      return null;
    }

    // Use InstantDB's built-in $users table
    // authUser.id is the userId from $users
    return {
      userId: authUser.id,
      email: authUser.email,
      name: authUser.email.split('@')[0], // Fallback name, can be updated in profile
    };
  };

  return {
    isAuthenticated: !!user,
    isLoading,
    pendingEmail,
    user,
    sendCode,
    verifyCode,
    logout,
    getCurrentUser,
  };
}

