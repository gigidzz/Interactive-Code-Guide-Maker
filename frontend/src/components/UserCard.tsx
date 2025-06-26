import React from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserCardProps {
  user: User;
  onLogout?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onLogout }) => {
  return (
    <div className="relative group">
      <div className="flex items-center space-x-3 cursor-pointer">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-medium text-gray-800">{user.username}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </div>
      
      {/* Dropdown menu on hover */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-800">{user.username}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        {onLogout && (
          <div className="p-2">
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;