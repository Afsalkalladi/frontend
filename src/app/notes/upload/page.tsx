"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, File, X, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const uploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  scheme_id: z.string().min(1, "Please select a scheme"),
  semester: z
    .number()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
  subject_id: z.string().min(1, "Please select a subject"),
  module_number: z
    .number()
    .min(1, "Module must be between 1 and 6")
    .max(6, "Module must be between 1 and 6"),
  tags: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface Scheme {
  id: number;
  name: string;
  year: number;
  description: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  semester: number;
  credits: number;
  scheme_id: number;
}

export default function NotesUploadPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current selections
  const [selectedScheme, setSelectedScheme] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

  // Fetch schemes and subjects from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");

        // Fetch schemes
        const schemesResponse = await fetch(
          `${API_BASE_URL}/auth/admin/academic-schemes/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Fetch subjects
        const subjectsResponse = await fetch(
          `${API_BASE_URL}/auth/admin/subjects/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (schemesResponse.ok && subjectsResponse.ok) {
          const schemesData = await schemesResponse.json();
          const subjectsData = await subjectsResponse.json();

          setSchemes(schemesData.schemes || []);
          setSubjects(subjectsData.subjects || []);
        } else {
          setError("Failed to fetch academic data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, API_BASE_URL]);

  // Filter subjects based on selected scheme and semester
  useEffect(() => {
    if (selectedScheme && selectedSemester) {
      const filtered = subjects.filter(
        (subject) =>
          subject.scheme_id === parseInt(selectedScheme) &&
          subject.semester === selectedSemester
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  }, [selectedScheme, selectedSemester, subjects]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      semester: 1,
    },
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please log in to upload notes.</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".txt",
        ".md",
      ];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error(
          "Please select a valid file type (PDF, DOC, DOCX, PPT, PPTX, TXT, MD)"
        );
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // In a real app, this would upload to the server
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("scheme_id", data.scheme_id);
      formData.append("semester", data.semester.toString());
      formData.append("subject_id", data.subject_id);
      formData.append("module_number", data.module_number.toString());
      if (data.tags) {
        formData.append("tags", data.tags);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Success
      setTimeout(() => {
        toast.success(
          "Notes uploaded successfully! They will be reviewed before publication."
        );
        reset();
        setSelectedFile(null);
        setUploadProgress(0);
        router.push("/library");
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Study Notes
          </h1>
          <p className="text-lg text-gray-600">
            Share your study materials with the EESA community. All uploads are
            reviewed before publication.
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File *
              </label>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">
                      Upload your study notes
                    </p>
                    <p className="text-sm text-gray-600">
                      Drag and drop a file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported: PDF, DOC, DOCX, PPT, PPTX, TXT, MD (Max 10MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Choose File
                  </Button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <File className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Uploading...</span>
                        <span className="text-gray-900">
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter a descriptive title for your notes"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Academic Information
              </h3>

              {/* Step 1: Select Scheme */}
              <div>
                <label
                  htmlFor="scheme_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Step 1: Select Academic Scheme *
                </label>
                <select
                  id="scheme_id"
                  {...register("scheme_id")}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.scheme_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose your academic scheme</option>
                  {schemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id.toString()}>
                      {scheme.name} ({scheme.year})
                    </option>
                  ))}
                </select>
                {errors.scheme_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.scheme_id.message}
                  </p>
                )}
              </div>

              {/* Step 2: Select Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Step 2: Select Semester *
                </label>
                <select
                  id="semester"
                  {...register("semester", { valueAsNumber: true })}
                  onChange={(e) =>
                    setSelectedSemester(parseInt(e.target.value))
                  }
                  disabled={!selectedScheme}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.semester ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.semester.message}
                  </p>
                )}
              </div>

              {/* Step 3: Select Subject */}
              <div>
                <label
                  htmlFor="subject_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Step 3: Select Subject *
                </label>
                <select
                  id="subject_id"
                  {...register("subject_id")}
                  disabled={!selectedScheme || !selectedSemester}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.subject_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose subject</option>
                  {filteredSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id.toString()}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subject_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.subject_id.message}
                  </p>
                )}
                {selectedScheme &&
                  selectedSemester &&
                  filteredSubjects.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      No subjects available for the selected scheme and
                      semester.
                    </p>
                  )}
              </div>

              {/* Step 4: Select Module */}
              <div>
                <label
                  htmlFor="module_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Step 4: Select Module *
                </label>
                <select
                  id="module_number"
                  {...register("module_number", { valueAsNumber: true })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.module_number ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select module</option>
                  {[1, 2, 3, 4, 5, 6].map((module) => (
                    <option key={module} value={module}>
                      Module {module}
                    </option>
                  ))}
                </select>
                {errors.module_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.module_number.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Provide a detailed description of the content covered in these notes"
                {...register("description")}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags (Optional)
              </label>
              <Input
                id="tags"
                type="text"
                placeholder="e.g., circuits, analysis, fundamentals (separate with commas)"
                {...register("tags")}
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags to help others find your notes easily
              </p>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload Guidelines
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Ensure your notes are original or you have permission to
                  share them
                </li>
                <li>• Use clear, descriptive titles and descriptions</li>
                <li>
                  • All uploads will be reviewed by teachers before being
                  published
                </li>
                <li>• File size should not exceed 10MB</li>
                <li>• Only educational content is allowed</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Notes</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
