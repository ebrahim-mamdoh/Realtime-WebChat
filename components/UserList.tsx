import { User, isUserOnline, getLastSeenText } from '@/lib/users';

interface UserListProps {
  users: User[];
  currentUserId: string;
  onUserSelect: (userId: string) => void;
}

export default function UserList({ users, currentUserId, onUserSelect }: UserListProps) {
  const filteredUsers = users.filter((user) => user.id !== currentUserId);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>
        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const online = isUserOnline(user.last_seen);
            const statusText = getLastSeenText(user.last_seen);

            return (
              <button
                key={user.id}
                onClick={() => onUserSelect(user.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition text-left"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                  {online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user.display_name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {online ? 'Online' : statusText}
                  </p>
                </div>
              </button>
            );
          })}
          {filteredUsers.length === 0 && (
            <p className="text-gray-500 text-center py-8">No users available</p>
          )}
        </div>
      </div>
    </div>
  );
}
