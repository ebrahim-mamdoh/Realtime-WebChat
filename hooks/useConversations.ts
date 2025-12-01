import { useState, useEffect } from 'react';
import { subscribeToConversations, Conversation } from '@/lib/firestore';

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToConversations(userId, (fetchedConversations) => {
      setConversations(fetchedConversations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { conversations, loading };
};
