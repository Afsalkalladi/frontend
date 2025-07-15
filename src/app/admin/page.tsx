"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Types
interface DashboardStats {
  totalStudents: number;
  pendingVerifications: number;
  activeForums: number;
  totalNotes: number;
}

interface RecentActivity {
  id: number;
  title: string;
  time: string;
  type: string;
}
import {
  Users,
  UserCheck,
  UserPlus,
  MessageSquare,
  BookOpen,
  Settings,
  Calendar,
  FileText,
  Shield,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [stats, setStats] = React.useState<DashboardStats>({
    totalStudents: 0,
    pendingVerifications: 0,
    activeForums: 0,
    totalNotes: 0,
  });
  const [recentActivity, setRecentActivity] = React.useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Fetch dashboard stats from API
  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${API_BASE_URL}/auth/admin/dashboard-stats/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalStudents: data.total_students,
            pendingVerifications: data.pending_approvals,
            activeForums: data.active_events,
            totalNotes: data.total_projects,
          });
          setRecentActivity(data.recent_activity || []);
        } else {
          setError("Failed to fetch dashboard statistics");
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Manage Students",
      description: "View, add, edit, and manage student accounts",
      icon: Users,
      href: "/admin/students",
      color: "bg-blue-500",
    },
    {
      title: "Verify Teachers",
      description: "Review and approve teacher registration requests",
      icon: UserCheck,
      href: "/admin/teachers",
      color: "bg-green-500",
    },
    {
      title: "Verify Alumni",
      description: "Review and approve alumni registration requests",
      icon: UserCheck,
      href: "/admin/alumni",
      color: "bg-purple-500",
    },
    {
      title: "Create Tech Head",
      description: "Promote users to tech head position",
      icon: UserPlus,
      href: "/admin/tech-heads",
      color: "bg-orange-500",
    },
    {
      title: "Manage Forum",
      description: "Moderate discussions and manage forum content",
      icon: MessageSquare,
      href: "/admin/forum",
      color: "bg-indigo-500",
    },
    {
      title: "Manage Academics",
      description: "Configure schemes, semesters, and subjects",
      icon: BookOpen,
      href: "/admin/academics",
      color: "bg-red-500",
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings and preferences",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
    {
      title: "Analytics",
      description: "View system usage statistics and reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-teal-500",
    },
  ];

  const quickStats = [
    {
      label: "Total Students",
      value: stats.totalStudents.toString(),
      icon: Users,
    },
    {
      label: "Pending Verifications",
      value: stats.pendingVerifications.toString(),
      icon: UserCheck,
    },
    {
      label: "Active Forums",
      value: stats.activeForums.toString(),
      icon: MessageSquare,
    },
    {
      label: "Total Notes",
      value: stats.totalNotes.toString(),
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Welcome back, {user.first_name}! Manage your EESA platform from
            here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                </div>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(card.href)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border shadow-sm mt-8">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6 pt-0">
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map(
                  (activity: RecentActivity, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity to display</p>
                <p className="text-sm text-gray-400">
                  Recent system activities will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
