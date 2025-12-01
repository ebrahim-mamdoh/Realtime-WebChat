import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export const formatMessageTime = (timestamp: Timestamp | null): string => {
  if (!timestamp) return '';

  const date = timestamp.toDate();

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'HH:mm')}`;
  }

  return format(date, 'MMM d, HH:mm');
};

export const formatChatListTime = (timestamp: Timestamp | null): string => {
  if (!timestamp) return '';

  const date = timestamp.toDate();

  if (isToday(date)) {
    return format(date, 'HH:mm');
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d');
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
