"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import {
  UserCheck,
  Search,
  Mail,
  ArrowLeft,
  CheckCircle,
  X,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

// Types
interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  date_joined: string;
  is_active: boolean;
  is_approved: boolean;
}

const TeachersManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Fetch all teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        // Fetch both pending and all teachers
        const [pendingResponse, allUsers] = await Promise.all([
          apiRequest<{ pending_teachers: Teacher[] }>(
            "GET",
            "/api/auth/admin/teachers/pending/"
          ).catch(() => ({ pending_teachers: [] })),
          apiRequest<{ students: Teacher[] }>(
            "GET",
            "/api/auth/admin/students/"
          ).catch(() => ({ students: [] })),
        ]);

        // Filter for teachers from all users
        const allTeachers =
          allUsers.students?.filter(
            (user) =>
              user.username.includes("teacher") ||
              user.email.includes("teacher")
          ) || [];
        const pendingTeachers = pendingResponse.pending_teachers || [];

        // Combine and deduplicate
        const combined = [...pendingTeachers, ...allTeachers];
        const uniqueTeachers = combined.filter(
          (teacher, index, self) =>
            index === self.findIndex((t) => t.id === teacher.id)
        );

        setTeachers(uniqueTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Failed to fetch teachers");
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchTeachers();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !teacher.is_approved) ||
      (filterStatus === "approved" && teacher.is_approved) ||
      (filterStatus === "active" && teacher.is_active) ||
      (filterStatus === "inactive" && !teacher.is_active);

    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (teacherId: number) => {
    try {
      await apiRequest(
        "POST",
        `/api/auth/admin/teachers/${teacherId}/approve/`
      );
      toast.success("Teacher approved successfully!");
      // Update the list
      setTeachers(
        teachers.map((t) =>
          t.id === teacherId ? { ...t, is_approved: true } : t
        )
      );
    } catch (error) {
      console.error("Error approving teacher:", error);
      toast.error("Failed to approve teacher");
    }
  };

  const handleReject = async (teacherId: number) => {
    if (
      !confirm(
        "Are you sure you want to reject this teacher? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiRequest("POST", `/api/auth/admin/teachers/${teacherId}/reject/`);
      toast.success("Teacher rejected and removed");
      // Remove from list
      setTeachers(teachers.filter((t) => t.id !== teacherId));
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      toast.error("Failed to reject teacher");
    }
  };

  const handleEdit = (teacherId: number) => {
    toast("Edit functionality coming soon!", { icon: "ℹ️" });
    console.log("Edit teacher:", teacherId);
  };

  const handleDelete = async (teacherId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this teacher? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiRequest("DELETE", `/api/auth/admin/users/${teacherId}/`);
      toast.success("Teacher deleted successfully");
      setTeachers(teachers.filter((t) => t.id !== teacherId));
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher");
    }
  };

  const handleAddTeacher = () => {
    toast("Add teacher functionality coming soon!", { icon: "ℹ️" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Teachers Management
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Manage teacher accounts, verify registrations, and handle CRUD
            operations.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Teachers</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button
                onClick={handleAddTeacher}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </div>
          </div>
        </div>

        {/* Teachers List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading teacher applications...</p>
            </div>
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-lg border shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {teacher.first_name} {teacher.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">@{teacher.username}</p>
                  </div>
                  <div className="flex gap-2">
                    {!teacher.is_approved && (
                      <>
                        <Button
                          onClick={() => handleApprove(teacher.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(teacher.id)}
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(teacher.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(teacher.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Registered:</span>
                    <span>
                      {new Date(teacher.date_joined).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Teacher Applications
              </h3>
              <p className="text-gray-600">
                Teacher applications will appear here when submitted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersManagement;
