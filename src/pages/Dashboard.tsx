import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0E27]">
      {/* Navbar */}
      <nav className="bg-[#13182E] border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📚</span>
              </div>
              <h1 className="text-xl font-bold text-white">StudyDeck</h1>
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-medium text-white">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 rounded-lg hover:bg-red-600/20 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-400">Welcome to your study workspace</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Notes */}
          <div className="bg-[#13182E] rounded-2xl p-6 border border-gray-800 hover:border-blue-600/50 transition group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
            <p className="text-sm text-gray-400 mb-4">
              Create and organize your study notes
            </p>
            <div className="flex items-center text-blue-400 text-sm font-medium">
              View all
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-[#13182E] rounded-2xl p-6 border border-gray-800 hover:border-green-600/50 transition group cursor-pointer">
            <div className="w-12 h-12 bg-green-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/20 transition">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tasks</h3>
            <p className="text-sm text-gray-400 mb-4">
              Manage your study tasks
            </p>
            <div className="flex items-center text-green-400 text-sm font-medium">
              View all
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Folders */}
          <div className="bg-[#13182E] rounded-2xl p-6 border border-gray-800 hover:border-purple-600/50 transition group cursor-pointer">
            <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600/20 transition">
              <span className="text-3xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Folders</h3>
            <p className="text-sm text-gray-400 mb-4">
              Organize notes into folders
            </p>
            <div className="flex items-center text-purple-400 text-sm font-medium">
              View all
              <svg
                className="w-4 h-4 ml-1 group-hover:translate-x-1 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
