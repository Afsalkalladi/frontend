"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import {
  CheckCircle,
  X,
  Eye,
  Download,
  User,
  Calendar,
  BookOpen,
  Tag,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

// Types
interface Note {
  id: number;
  title: string;
  description: string;
  note_type: string;
  module_number: number;
  subject_details: {
    id: number;
    name: string;
    code: string;
    scheme_details: {
      id: number;
      name: string;
      year: number;
    };
    semester: number;
  };
  uploaded_by: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  file: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

interface Statistics {
  pending_count: number;
  approved_today: number;
  total_reviewed: number;
}

const NotesVerification = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [notes, setNotes] = useState<Note[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    pending_count: 0,
    approved_today: 0,
    total_reviewed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user ||
      !["teacher", "tech_head"].includes(user.role)
    ) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Fetch notes and statistics
  useEffect(() => {
    const fetchData = async () => {
      if (
        !isAuthenticated ||
        !user ||
        !["teacher", "tech_head"].includes(user.role)
      ) {
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching notes for verification...");

        // Determine which endpoint to call based on filter
        let endpoint = "/api/academics/notes/pending/";
        if (filterStatus === "all") {
          endpoint = "/api/academics/notes/?approved_only=false";
        } else if (filterStatus === "approved") {
          endpoint = "/api/academics/notes/approved/";
        }

        const [notesResponse, statsResponse] = await Promise.all([
          apiRequest<{
            pending_notes?: Note[];
            approved_notes?: Note[];
            notes?: Note[];
            count: number;
          }>("GET", endpoint).catch((err) => {
            console.error("Error fetching notes:", err);
            return {
              pending_notes: [],
              approved_notes: [],
              notes: [],
              count: 0,
            };
          }),
          // For now, calculate stats from the notes data
          // In the future, you could create a dedicated stats endpoint
          apiRequest<{ pending_notes: Note[]; count: number }>(
            "GET",
            "/api/academics/notes/pending/"
          ).catch((err) => {
            console.error("Error fetching stats:", err);
            return { pending_notes: [], count: 0 };
          }),
        ]);

        const fetchedNotes =
          notesResponse.pending_notes ||
          notesResponse.approved_notes ||
          notesResponse.notes ||
          [];
        setNotes(fetchedNotes);

        // Calculate statistics
        const pendingCount = statsResponse.pending_notes?.length || 0;
        const today = new Date().toISOString().split("T")[0];
        const approvedToday = fetchedNotes.filter(
          (note) => note.is_approved && note.updated_at.startsWith(today)
        ).length;

        setStatistics({
          pending_count: pendingCount,
          approved_today: approvedToday,
          total_reviewed: fetchedNotes.filter((note) => note.is_approved)
            .length,
        });

        console.log("Fetched data:", {
          notes: fetchedNotes.length,
          pending: pendingCount,
          approvedToday,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch notes data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, filterStatus]);

  if (
    !isAuthenticated ||
    !user ||
    !["teacher", "tech_head"].includes(user.role)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need teacher or tech head privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject_details.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.uploaded_by.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.uploaded_by.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !note.is_approved) ||
      (filterStatus === "approved" && note.is_approved);

    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (noteId: number) => {
    try {
      console.log("Approving note:", noteId);
      await apiRequest("POST", "/api/academics/notes/approve/", {
        note_id: noteId,
      });
      toast.success("Note approved successfully!");

      // Refresh the notes list
      setNotes(
        notes.map((note) =>
          note.id === noteId ? { ...note, is_approved: true } : note
        )
      );
    } catch (error) {
      console.error("Error approving note:", error);
      toast.error("Failed to approve note");
    }
  };

  const handleReject = async (noteId: number) => {
    if (
      !confirm(
        "Are you sure you want to reject this note? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      console.log("Rejecting note:", noteId);
      await apiRequest("DELETE", `/api/academics/notes/${noteId}/reject/`);
      toast.success("Note rejected successfully!");

      // Remove the note from the list
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error rejecting note:", error);
      toast.error("Failed to reject note");
    }
  };

  const handlePreview = (noteId: number) => {
    console.log("Preview note:", noteId);
    // In real implementation, this would open the file preview
    toast.success("File preview functionality will be implemented soon");
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
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Notes Verification
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Review and verify notes submitted by students and alumni.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by title, subject, or uploader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending Verification</option>
                <option value="approved">Approved</option>
                <option value="all">All Notes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading notes...</p>
            </div>
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {note.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {note.description}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          note.is_approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {note.is_approved ? "approved" : "pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span>
                          {note.subject_details.name} (
                          {note.subject_details.code})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Semester {note.subject_details.semester} (
                          {note.subject_details.scheme_details.year})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          {note.uploaded_by.first_name}{" "}
                          {note.uploaded_by.last_name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Role: {note.uploaded_by.role}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                        <Tag className="w-3 h-3" />
                        {note.note_type}
                      </span>
                      {note.module_number > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                          <Tag className="w-3 h-3" />
                          Module {note.module_number}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                        <Tag className="w-3 h-3" />
                        {note.subject_details.scheme_details.name}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      Uploaded on{" "}
                      {new Date(note.created_at).toLocaleDateString()} at{" "}
                      {new Date(note.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(note.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    {note.file && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    )}
                    {!note.is_approved && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(note.id)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(note.id)}
                          className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Notes to Verify
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "pending"
                  ? "No notes match your current filters."
                  : "All notes have been reviewed."}
              </p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Verification
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.pending_count}
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
                <p className="text-sm font-medium text-gray-600">
                  Approved Today
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.approved_today}
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
                <p className="text-sm font-medium text-gray-600">
                  Total Reviewed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.total_reviewed}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesVerification;
