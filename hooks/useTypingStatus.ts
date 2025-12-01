import { useState, useEffect } from 'react';
import { subscribeToTypingStatus } from '@/lib/firestore';

export const useTypingStatus = (conversationId: string | undefined, currentUserId: string | undefined) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | undefined>();

  useEffect(() => {
    if (!conversationId || !currentUserId) {
      return;
    }

    const unsubscribe = subscribeToTypingStatus(conversationId, currentUserId, (typing, userId) => {
      setIsTyping(typing);
      setTypingUserId(userId);
    });

    return () => unsubscribe();
  }, [conversationId, currentUserId]);

  return { isTyping, typingUserId };
};
