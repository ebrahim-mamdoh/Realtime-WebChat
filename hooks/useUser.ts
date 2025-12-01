import { useState, useEffect } from 'react';
import { subscribeToUser, User } from '@/lib/users';

export const useUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUser(userId, (fetchedUser) => {
      setUser(fetchedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { user, loading };
};
