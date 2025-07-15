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
  Building,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

// Types
interface Alumni {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  date_joined: string;
  is_active: boolean;
  is_approved: boolean;
}

const AlumniManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Fetch all alumni from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<{ alumni: Alumni[] }>(
          "GET",
          "/api/auth/admin/alumni/"
        );
        setAlumni(response.alumni || []);
      } catch (error) {
        console.error("Error fetching alumni:", error);
        toast.error("Failed to fetch alumni");
        setAlumni([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchAlumni();
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

  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearch =
      alumnus.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !alumnus.is_approved) ||
      (filterStatus === "approved" && alumnus.is_approved) ||
      (filterStatus === "active" && alumnus.is_active) ||
      (filterStatus === "inactive" && !alumnus.is_active);

    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (alumniId: number) => {
    try {
      await apiRequest("POST", `/api/auth/admin/alumni/${alumniId}/approve/`);
      toast.success("Alumni approved successfully!");
      // Refresh the list
      setAlumni(
        alumni.map((a) => (a.id === alumniId ? { ...a, is_approved: true } : a))
      );
    } catch (error) {
      console.error("Error approving alumni:", error);
      toast.error("Failed to approve alumni");
    }
  };

  const handleReject = async (alumniId: number) => {
    if (
      !confirm(
        "Are you sure you want to reject this alumni? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiRequest("POST", `/api/auth/admin/alumni/${alumniId}/reject/`);
      toast.success("Alumni rejected and removed");
      // Remove from list
      setAlumni(alumni.filter((a) => a.id !== alumniId));
    } catch (error) {
      console.error("Error rejecting alumni:", error);
      toast.error("Failed to reject alumni");
    }
  };

  const handleEdit = (alumniId: number) => {
    toast("Edit functionality coming soon!", { icon: "ℹ️" });
    console.log("Edit alumni:", alumniId);
  };

  const handleDelete = async (alumniId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this alumni? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiRequest("DELETE", `/api/auth/admin/users/${alumniId}/`);
      toast.success("Alumni deleted successfully");
      setAlumni(alumni.filter((a) => a.id !== alumniId));
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast.error("Failed to delete alumni");
    }
  };

  const handleAddAlumni = () => {
    toast("Add alumni functionality coming soon!", { icon: "ℹ️" });
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
              <UserCheck className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Alumni Management
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Manage alumni accounts, verify registrations, and handle CRUD
            operations.
          </p>
        </div>

        {/* Actions and Search */}
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
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Alumni</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Button
                onClick={handleAddAlumni}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Alumni
              </Button>
            </div>
          </div>
        </div>

        {/* Alumni List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading alumni...</p>
            </div>
          ) : filteredAlumni.length > 0 ? (
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumni
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAlumni.map((alumnus) => (
                      <tr key={alumnus.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {alumnus.first_name} {alumnus.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{alumnus.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {alumnus.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                alumnus.is_approved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {alumnus.is_approved ? "Approved" : "Pending"}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-1 ${
                                alumnus.is_active
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {alumnus.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(alumnus.date_joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {!alumnus.is_approved && (
                              <>
                                <Button
                                  onClick={() => handleApprove(alumnus.id)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleReject(alumnus.id)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(alumnus.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(alumnus.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Alumni Found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all"
                  ? "No alumni match your current filters."
                  : "No alumni registered yet."}
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Alumni
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {alumni.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {alumni.filter((a) => !a.is_approved).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alumni.filter((a) => a.is_approved).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alumni.filter((a) => a.is_active).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniManagement;
