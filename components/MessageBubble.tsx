import { Message } from '@/lib/firestore';
import { formatMessageTime } from '@/lib/utils';
import Image from 'next/image';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
}

export default function MessageBubble({ message, isOwn, senderName }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && senderName && (
          <span className="text-xs text-gray-500 mb-1 px-3">{senderName}</span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary-600 text-white rounded-br-md'
              : 'bg-gray-200 text-gray-900 rounded-bl-md'
          }`}
        >
          {message.image_url && (
            <div className="mt-2">
              <img
                src={message.image_url}
                alt="Shared image"
                width={300}
                height={300}
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}
          {message.text && <p className="break-words">{message.text}</p>}
          <span
            className={`text-xs mt-1 block ${
              isOwn ? 'text-primary-100' : 'text-gray-500'
            }`}
          >
            {formatMessageTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
