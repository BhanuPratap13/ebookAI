import React from "react";
import { LogOut, User } from "lucide-react";

const ProfileMenu = ({ isOpen, onToggle, avatarUrl, username, email, signoutCallback }) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        <span className="text-gray-700 text-sm font-medium hidden sm:block">
          {username}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{username}</p>
                <p className="text-xs text-gray-500 truncate max-w-[160px]">{email}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={signoutCallback}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 rounded-b-xl"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
