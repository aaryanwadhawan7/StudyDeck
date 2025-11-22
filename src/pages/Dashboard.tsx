import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const stats = [
    {
      icon: "📝",
      label: "Notes",
      count: 12,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "✓",
      label: "Tasks",
      count: 8,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "📁",
      label: "Folders",
      count: 5,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "🏷️",
      label: "Tags",
      count: 15,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navbar */}
      <nav className="backdrop-blur-xl bg-slate-900/50 border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📚</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StudyDeck
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-400">Welcome back,</p>
                <p className="font-semibold text-white">{user?.name}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-80"
                  >
                    {user?.name.charAt(0).toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800 border-slate-700"
                >
                  <DropdownMenuItem className="text-slate-200">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-slate-200">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:bg-red-500/20"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur hover:border-slate-600 transition-all hover:scale-105 cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.label}
                  </CardTitle>
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}
                  >
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stat.count}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {Math.floor(Math.random() * 10) + 1} new this week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Notes Card */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur overflow-hidden hover:border-blue-500/50 transition-all">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <CardHeader>
              <CardTitle className="text-lg text-white">📝 Notes</CardTitle>
              <CardDescription className="text-slate-400">
                Create and organize your study materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Open Notes
              </Button>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur overflow-hidden hover:border-green-500/50 transition-all">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <CardHeader>
              <CardTitle className="text-lg text-white">✓ Tasks</CardTitle>
              <CardDescription className="text-slate-400">
                Manage deadlines and track progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-white">8</span>
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300 border-green-500/30"
                >
                  Pending
                </Badge>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                View Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Folders Card */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur overflow-hidden hover:border-purple-500/50 transition-all">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader>
              <CardTitle className="text-lg text-white">📁 Folders</CardTitle>
              <CardDescription className="text-slate-400">
                Organize content hierarchically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-white">5</span>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  Total
                </Badge>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Browse Folders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">📊 Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  action: 'Created "Math Chapter 5" note',
                  time: "2 hours ago",
                },
                {
                  action: 'Completed "Physics Assignment" task',
                  time: "4 hours ago",
                },
                { action: 'Added new folder "Chemistry"', time: "1 day ago" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{item.action}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
