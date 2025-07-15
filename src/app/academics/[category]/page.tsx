"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  BookOpen,
  Download,
  Search,
  FileText,
  User,
  ChevronLeft,
  Star,
} from "lucide-react";

interface AcademicResource {
  id: number;
  title: string;
  description: string;
  file: string;
  module: string;
  exam_type: string;
  year: number;
  semester: number;
  scheme: string;
  uploaded_by: string;
  uploaded_at: string;
  download_count: number;
  is_featured: boolean;
  is_approved: boolean;
  file_size: number;
}

interface AcademicCategory {
  id: number;
  name: string;
  description: string;
  category_type: string;
  icon: string;
  slug: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;

  const [category, setCategory] = useState<AcademicCategory | null>(null);
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  // Get category type from slug
  const getCategoryType = (slug: string) => {
    if (slug === "notes") return "notes";
    if (slug === "textbooks") return "textbook";
    if (slug === "pyq") return "pyq";
    return slug;
  };

  const getCategoryInfo = (type: string) => {
    const categoryTypes = {
      notes: {
        name: "Notes",
        description: "Comprehensive study notes and materials",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",
      },
      textbooks: {
        name: "Textbooks",
        description: "Reference books and study materials",
        icon: BookOpen,
        color: "from-green-500 to-emerald-500",
      },
      pyq: {
        name: "Previous Year Questions",
        description: "Past examination papers and model questions",
        icon: FileText,
        color: "from-purple-500 to-violet-500",
      },
    };
    return categoryTypes[type as keyof typeof categoryTypes];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryType = getCategoryType(categorySlug);

        // Fetch category info
        try {
          const categoryData = await apiRequest(
            "GET",
            `/academics/categories/${categoryType}/`
          );
          if (categoryData && (categoryData as any).category) {
            const category = (categoryData as any).category;
            setCategory({
              id: category.id,
              name: category.name,
              description: category.description,
              category_type: category.category_type,
              icon: category.icon,
              slug: category.slug || categoryType,
            });
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        }

        // Fetch resources for this category type
        try {
          const resourcesData = await apiRequest(
            "GET",
            `/academics/resources/?category_type=${categoryType}`
          );

          if (Array.isArray(resourcesData)) {
            // Transform API data to match our interface
            const transformedResources = resourcesData.map((resource: any) => ({
              id: resource.id,
              title: resource.title,
              description: resource.description,
              file: resource.file || "",
              module: resource.module_display || "General",
              exam_type: resource.exam_type_display || "N/A",
              year: resource.exam_year || new Date().getFullYear(),
              semester: resource.subject_details?.semester || 0,
              scheme: resource.scheme_name || "Unknown",
              uploaded_by: resource.uploaded_by_name,
              uploaded_at: resource.created_at,
              download_count: resource.download_count,
              is_featured: resource.is_featured,
              is_approved: resource.is_approved,
              file_size: Math.round((resource.file_size_mb || 0) * 1024 * 1024), // Convert MB to bytes
            }));

            setResources(transformedResources);
          } else {
            setResources([]);
          }
        } catch (resourceError) {
          console.error("Error fetching resources:", resourceError);
          setResources([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data on error
        const categoryType = getCategoryType(categorySlug);
        const mockCategory = {
          id: 1,
          name: getCategoryInfo(categoryType)?.name || "Academic Resources",
          description: getCategoryInfo(categoryType)?.description || "",
          category_type: categoryType,
          icon: "book",
          slug: categorySlug,
        };
        setCategory(mockCategory);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = !selectedModule || resource.module === selectedModule;
    const matchesSemester =
      !selectedSemester || resource.semester.toString() === selectedSemester;
    const matchesScheme = !selectedScheme || resource.scheme === selectedScheme;
    const matchesExamType =
      !selectedExamType || resource.exam_type === selectedExamType;

    return (
      matchesSearch &&
      matchesModule &&
      matchesSemester &&
      matchesScheme &&
      matchesExamType
    );
  });

  const categoryInfo = category
    ? getCategoryInfo(category.category_type)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (!category || !categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <Link
            href="/academics"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Academics
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${categoryInfo.color} text-white py-12`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/academics"
              className="text-white/80 hover:text-white flex items-center gap-2 text-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Academics
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-white/90 mt-2">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Modules</option>
              <option value="Module 1">Module 1</option>
              <option value="Module 2">Module 2</option>
              <option value="Module 3">Module 3</option>
              <option value="Module 4">Module 4</option>
              <option value="Module 5">Module 5</option>
            </select>

            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem.toString()}>
                  Semester {sem}
                </option>
              ))}
            </select>

            {/* Scheme Filter */}
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Schemes</option>
              <option value="2018">2018 Scheme</option>
              <option value="2021">2021 Scheme</option>
            </select>

            {/* Exam Type Filter (for PYQ) */}
            {category.category_type === "pyq" && (
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Exam Types</option>
                <option value="CIE">CIE</option>
                <option value="SEE">SEE</option>
                <option value="Model">Model Papers</option>
              </select>
            )}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {resource.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <h3 className="font-semibold text-gray-800 line-clamp-2">
                      {resource.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {resource.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Module: {resource.module}</span>
                  <span>Sem {resource.semester}</span>
                </div>

                {category.category_type === "pyq" && (
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Exam: {resource.exam_type}</span>
                    <span>Year: {resource.year}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{formatFileSize(resource.file_size)}</span>
                  <span>{resource.scheme} Scheme</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {resource.download_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {resource.uploaded_by}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(resource.uploaded_at)}
                </span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
