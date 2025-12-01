import { useConversations } from '@/hooks/useConversations';
import { useUsers } from '@/hooks/useUsers';
import { formatChatListTime, truncateText } from '@/lib/utils';
import { useRouter } from 'next/router';
import { getConversationId } from '@/lib/firestore';

interface ChatListProps {
  currentUserId: string;
}

export default function ChatList({ currentUserId }: ChatListProps) {
  const { conversations, loading: conversationsLoading } = useConversations(currentUserId);
  const { users } = useUsers();
  const router = useRouter();

  const getOtherUserId = (participants: string[]) => {
    return participants.find((id) => id !== currentUserId) || '';
  };

  const getOtherUser = (participants: string[]) => {
    const otherUserId = getOtherUserId(participants);
    return users.find((user) => user.id === otherUserId);
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  if (conversationsLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation.participants);
            if (!otherUser) return null;

            return (
              <button
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition text-left"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                  {otherUser.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 truncate">
                      {otherUser.display_name}
                    </p>
                    {conversation.lastMessageTime && (
                      <span className="text-xs text-gray-500">
                        {formatChatListTime(conversation.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage
                      ? truncateText(conversation.lastMessage, 40)
                      : 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
          {conversations.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No conversations yet. Start chatting with someone!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
