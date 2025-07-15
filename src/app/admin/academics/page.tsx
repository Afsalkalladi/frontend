"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import {
  BookOpen,
  Search,
  ArrowLeft,
  CheckCircle,
  X,
  FileText,
  Download,
  Calendar,
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
  };
  file: string | null;
  is_approved: boolean;
  created_at: string;
}

interface Scheme {
  id: number;
  name: string;
  year: number;
  is_active: boolean;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  scheme_details: {
    id: number;
    name: string;
    year: number;
  };
  semester: number;
}

const AcademicsManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"pending" | "all">("pending");

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching academic data...");
        const [
          pendingResponse,
          allNotesResponse,
          schemesResponse,
          subjectsResponse,
        ] = await Promise.all([
          apiRequest<{ pending_notes: Note[]; count: number }>(
            "GET",
            "/api/academics/notes/pending/"
          ).catch((err) => {
            console.error("Error fetching pending notes:", err);
            return { pending_notes: [], count: 0 };
          }),
          apiRequest<{ notes: Note[]; count: number }>(
            "GET",
            "/api/academics/notes/?approved_only=false"
          ).catch((err) => {
            console.error("Error fetching all notes:", err);
            return { notes: [], count: 0 };
          }),
          apiRequest<{ schemes: Scheme[] }>(
            "GET",
            "/api/auth/admin/academic-schemes/"
          ).catch((err) => {
            console.error("Error fetching schemes:", err);
            return { schemes: [] };
          }),
          apiRequest<{ subjects: Subject[] }>(
            "GET",
            "/api/auth/admin/subjects/"
          ).catch((err) => {
            console.error("Error fetching subjects:", err);
            return { subjects: [] };
          }),
        ]);

        console.log("Fetched data:", {
          pendingNotes: pendingResponse.pending_notes?.length || 0,
          allNotes: allNotesResponse.notes?.length || 0,
          schemes: schemesResponse.schemes?.length || 0,
          subjects: subjectsResponse.subjects?.length || 0,
        });

        setPendingNotes(pendingResponse.pending_notes || []);
        setAllNotes(allNotesResponse.notes || []);
        setSchemes(schemesResponse.schemes || []);
        setSubjects(subjectsResponse.subjects || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch academic data");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      console.log("User is authenticated admin, fetching data...");
      fetchData();
    } else {
      console.log("User not authenticated or not admin:", {
        isAuthenticated,
        userRole: user?.role,
      });
    }
  }, [isAuthenticated, user]);

  const handleApproveNote = async (noteId: number) => {
    try {
      console.log("Approving note with ID:", noteId);
      const response = await apiRequest(
        "POST",
        "/api/academics/notes/approve/",
        {
          note_id: noteId,
        }
      );
      console.log("Approve response:", response);
      toast.success("Note approved successfully!");

      // Update the notes lists
      setPendingNotes(pendingNotes.filter((note) => note.id !== noteId));

      // Refresh all notes to get the updated note
      const allNotesResponse = await apiRequest<{
        notes: Note[];
        count: number;
      }>("GET", "/api/academics/notes/?approved_only=false");
      setAllNotes(allNotesResponse.notes || []);
    } catch (error) {
      console.error("Error approving note:", error);
      toast.error("Failed to approve note");
    }
  };

  const handleRejectNote = async (noteId: number) => {
    if (
      !confirm(
        "Are you sure you want to reject this note? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiRequest("DELETE", `/api/academics/notes/${noteId}/delete/`);
      toast.success("Note rejected and removed");

      // Remove from both lists
      setPendingNotes(pendingNotes.filter((note) => note.id !== noteId));
      setAllNotes(allNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error rejecting note:", error);
      toast.error("Failed to reject note");
    }
  };

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

  const currentNotes = view === "pending" ? pendingNotes : allNotes;
  const filteredNotes = currentNotes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject_details?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.uploaded_by?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      note.uploaded_by?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || note.note_type === filterType;
    const matchesScheme =
      !selectedScheme ||
      note.subject_details.scheme_details.id.toString() === selectedScheme;
    const matchesSemester =
      !selectedSemester ||
      note.subject_details.semester.toString() === selectedSemester;

    return matchesSearch && matchesType && matchesScheme && matchesSemester;
  });

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
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Academic Content Management
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Manage academic notes, verify uploads, and handle content
            moderation.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pending Notes
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {pendingNotes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Approved Notes
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {allNotes.filter((n) => n.is_approved).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Schemes
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {schemes.filter((s) => s.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Subjects
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {subjects.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Tabs */}
            <div className="flex gap-2">
              <Button
                onClick={() => setView("pending")}
                variant={view === "pending" ? "default" : "outline"}
                className={
                  view === "pending" ? "bg-orange-600 hover:bg-orange-700" : ""
                }
              >
                Pending Verification ({pendingNotes.length})
              </Button>
              <Button
                onClick={() => setView("all")}
                variant={view === "all" ? "default" : "outline"}
                className={
                  view === "all" ? "bg-blue-600 hover:bg-blue-700" : ""
                }
              >
                All Notes ({allNotes.length})
              </Button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by title, description, subject, or uploader..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="module">Module Notes</option>
                <option value="textbook">Textbooks</option>
                <option value="pyq">Previous Year Questions</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Schemes</option>
                {schemes.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.name} ({scheme.year})
                  </option>
                ))}
              </select>

              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
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
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border shadow-sm p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {note.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{note.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {note.subject_details.name} (
                          {note.subject_details.code})
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {note.subject_details.scheme_details.name}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          Semester {note.subject_details.semester}
                        </span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {note.note_type.charAt(0).toUpperCase() +
                            note.note_type.slice(1)}
                          {note.module_number > 0 &&
                            ` - Module ${note.module_number}`}
                        </span>
                        {view === "all" && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              note.is_approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {note.is_approved ? "Approved" : "Pending"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {view === "pending" && (
                        <>
                          <Button
                            onClick={() => handleApproveNote(note.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleRejectNote(note.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {note.file && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-3 text-sm text-gray-500">
                    <div className="flex justify-between items-center">
                      <span>
                        Uploaded by {note.uploaded_by.first_name}{" "}
                        {note.uploaded_by.last_name} ({note.uploaded_by.email})
                      </span>
                      <span>
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {view === "pending" ? "Pending" : ""} Notes Found
              </h3>
              <p className="text-gray-600">
                {searchTerm ||
                filterType !== "all" ||
                selectedScheme ||
                selectedSemester
                  ? "No notes match your current filters."
                  : view === "pending"
                  ? "No notes are waiting for verification."
                  : "No notes have been uploaded yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicsManagement;
