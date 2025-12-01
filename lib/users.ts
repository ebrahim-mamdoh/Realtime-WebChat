import { supabase } from './supabase';

export interface User {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
  last_seen: string;
  is_anonymous: boolean;
  created_at: string;
}

export const isUserOnline = (lastSeen: string | null): boolean => {
  if (!lastSeen) return false;
  
  const now = Date.now();
  const lastSeenTime = new Date(lastSeen).getTime();
  const diffSeconds = (now - lastSeenTime) / 1000;

  return diffSeconds < 60;
};

export const getLastSeenText = (lastSeen: string | null): string => {
  if (!lastSeen) return 'Offline';
  
  if (isUserOnline(lastSeen)) {
    return 'Online';
  }

  const now = Date.now();
  const lastSeenTime = new Date(lastSeen).getTime();
  const diffMs = now - lastSeenTime;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return new Date(lastSeen).toLocaleDateString();
};

export const subscribeToUsers = (callback: (users: User[]) => void) => {
  const fetchUsers = async () => {
    console.log('🔍 Fetching users...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('last_seen', { ascending: false });

    console.log('📊 Users query result:', { data, error });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    if (data) {
      console.log('✅ Found users:', data.length, data);
      callback(data);
    } else {
      console.log('⚠️ No users data returned');
    }
  };

  fetchUsers();

  const channel = supabase
    .channel('users')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users',
      },
      () => {
        fetchUsers();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToUser = (userId: string, callback: (user: User | null) => void) => {
  const fetchUser = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      callback(data);
    } else {
      callback(null);
    }
  };

  fetchUser();

  const channel = supabase
    .channel(`user:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`,
      },
      () => {
        fetchUser();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
