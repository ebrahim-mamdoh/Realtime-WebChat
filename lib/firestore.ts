import { supabase } from './supabase';

export interface Message {
  id: string;
  sender_id: string;
  conversation_id: string;
  text: string;
  image_url?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: string;
  last_message_time?: string;
  updated_at: string;
}

// Generate conversation ID from two user IDs
export const getConversationId = (userId1: string, userId2: string): string => {
  const sorted = [userId1, userId2].sort();
  return `${sorted[0]}_${sorted[1]}`;
};

// Create or get a conversation
export const createConversation = async (userId1: string, userId2: string) => {
  const conversationId = getConversationId(userId1, userId2);

  try {
    const { error } = await supabase
      .from('conversations')
      .upsert({
        id: conversationId,
        participants: [userId1, userId2],
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return conversationId;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Send a text message
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  text: string,
  imageUrl?: string
) => {
  try {
    // Insert message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        text,
        image_url: imageUrl || null,
      });

    if (messageError) throw messageError;

    // Update conversation's last message
    const { error: convError } = await supabase
      .from('conversations')
      .update({
        last_message: text || '[Image]',
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (convError) throw convError;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Subscribe to messages in a conversation
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void,
  messageLimit: number = 50
) => {
  // Initial fetch
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(messageLimit);

    if (!error && data) {
      callback(data);
    }
  };

  fetchMessages();

  // Subscribe to real-time changes
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      () => {
        fetchMessages();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Subscribe to user's conversations
export const subscribeToConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void
) => {
  // Initial fetch
  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });

    if (!error && data) {
      callback(data);
    }
  };

  fetchConversations();

  // Subscribe to real-time changes
  const channel = supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participants.cs.{${userId}}`,
      },
      () => {
        fetchConversations();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Typing indicator helpers
export const setTypingStatus = async (conversationId: string, userId: string, isTyping: boolean) => {
  try {
    if (isTyping) {
      await supabase
        .from('typing_indicators')
        .upsert({
          conversation_id: conversationId,
          user_id: userId,
          updated_at: new Date().toISOString(),
        });
    } else {
      await supabase
        .from('typing_indicators')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Error setting typing status:', error);
  }
};

export const subscribeToTypingStatus = (
  conversationId: string,
  currentUserId: string,
  callback: (isTyping: boolean, userId?: string) => void
) => {
  const fetchTyping = async () => {
    const { data, error } = await supabase
      .from('typing_indicators')
      .select('*')
      .eq('conversation_id', conversationId)
      .neq('user_id', currentUserId);

    if (!error && data && data.length > 0) {
      callback(true, data[0].user_id);
    } else {
      callback(false);
    }
  };

  fetchTyping();

  const channel = supabase
    .channel(`typing:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `conversation_id=eq.${conversationId}`,
      },
      () => {
        fetchTyping();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
