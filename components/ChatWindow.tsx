import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useTypingStatus } from '@/hooks/useTypingStatus';
import { useUser } from '@/hooks/useUser';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { sendMessage } from '@/lib/firestore';
import { uploadImage, isImageFile, validateImageSize } from '@/lib/storage';
import { isUserOnline, getLastSeenText } from '@/lib/users';
import toast from 'react-hot-toast';

interface ChatWindowProps {
  conversationId: string;
  otherUserId: string;
  currentUserId: string;
}

export default function ChatWindow({
  conversationId,
  otherUserId,
  currentUserId,
}: ChatWindowProps) {
  const { messages, loading: messagesLoading } = useMessages(conversationId);
  const { isTyping } = useTypingStatus(conversationId, currentUserId);
  const { user: otherUser, loading: userLoading } = useUser(otherUserId);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setSending(true);
    try {
      await sendMessage(conversationId, currentUserId, text);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSendImage = async (file: File) => {
    if (!isImageFile(file)) {
      toast.error('Please select an image file');
      return;
    }

    if (!validateImageSize(file, 5)) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSending(true);
    const uploadToast = toast.loading('Uploading image...');

    try {
      const imageUrl = await uploadImage(file, currentUserId);
      await sendMessage(conversationId, currentUserId, '', imageUrl);
      toast.success('Image sent!', { id: uploadToast });
    } catch (error) {
      toast.error('Failed to upload image', { id: uploadToast });
      console.error('Error uploading image:', error);
    } finally {
      setSending(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  const online = isUserOnline(otherUser.last_seen);
  const statusText = getLastSeenText(otherUser.last_seen);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
              {otherUser.display_name.charAt(0).toUpperCase()}
            </div>
            {online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{otherUser.display_name}</h2>
            <p className="text-sm text-gray-500">{statusText}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                senderName={
                  message.senderId === currentUserId ? 'You' : otherUser.display_name
                }
              />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        disabled={sending}
      />
    </div>
  );
}
