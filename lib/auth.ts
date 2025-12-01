import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
  last_seen: string;
  is_anonymous: boolean;
  created_at: string;
}

export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    // Step 1: Create auth user (auto-login, no email confirmation)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: { 
          display_name: displayName 
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned from signup');

    // User is automatically authenticated here
    const user = data.user;

    // Step 2: Create user profile with matching ID
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        display_name: displayName,
        email: user.email,
        avatar_url: null,
        last_seen: new Date().toISOString(),
        is_anonymous: false,
        created_at: new Date().toISOString(),
      });

    // If profile already exists, skip gracefully
    if (profileError && !profileError.message?.includes('duplicate key')) {
      console.error('❌ Profile creation error:', profileError);
      throw profileError;
    }

    console.log('✅ User signed up and logged in:', user.id);
    return user;
  } catch (error: any) {
    console.error('❌ Signup error:', error);
    throw new Error(error.message || 'Signup failed');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInAsGuest = async () => {
  try {
    // Step 1: Create anonymous auth user
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned from anonymous signin');

    // Step 2: Wait for auth to register
    await new Promise(resolve => setTimeout(resolve, 100));

    const displayName = `Guest${authData.user.id.substring(0, 6)}`;

    // Step 3: Create user profile with matching ID (CRITICAL for RLS)
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id, // MUST match auth.uid() for RLS policy
        display_name: displayName,
        email: null,
        avatar_url: null,
        last_seen: new Date().toISOString(),
        is_anonymous: true,
        created_at: new Date().toISOString(),
      });

    // If profile already exists, skip gracefully
    if (profileError && !profileError.message?.includes('duplicate key')) {
      console.error('❌ Profile creation error:', profileError);
      throw profileError;
    }

    console.log('✅ Anonymous user signed in:', authData.user.id);

    return authData.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateLastSeen = async (userId: string) => {
  try {
    await supabase
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
};
