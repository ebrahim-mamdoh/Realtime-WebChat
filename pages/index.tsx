import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { createConversation, getConversationId } from '@/lib/firestore';
import ChatList from '@/components/ChatList';
import UserList from '@/components/UserList';
import { useUsers } from '@/hooks/useUsers';
import toast from 'react-hot-toast';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { users } = useUsers();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleUserSelect = async (otherUserId: string) => {
    if (!user) return;

    try {
      const conversationId = await createConversation(user.id, otherUserId);
      router.push(`/chat/${conversationId}`);
    } catch (error) {
      toast.error('Failed to start conversation');
      console.error('Error creating conversation:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                {user.user_metadata?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {user.user_metadata?.display_name || 'User'}
                </h1>
                <p className="text-sm text-gray-500">{user.email || 'Guest'}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'chats'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Chats
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                  activeTab === 'users'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Users
              </button>
            </div>

            {/* Content */}
            {activeTab === 'chats' ? (
              <ChatList currentUserId={user.id} />
            ) : (
              <UserList
                users={users}
                currentUserId={user.id}
                onUserSelect={handleUserSelect}
              />
            )}
          </div>

          {/* Empty state - shown on desktop */}
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
              <p className="text-lg font-medium mb-2">Welcome to Real-Time Chat</p>
              <p className="text-sm">Select a conversation or start chatting with someone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
