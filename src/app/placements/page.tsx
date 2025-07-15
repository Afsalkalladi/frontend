"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Building,
  TrendingUp,
  Calendar,
  MapPin,
  IndianRupee,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";

interface PlacementDrive {
  id: number;
  title: string;
  company_name: string;
  company_logo?: string;
  job_type: string;
  package_lpa?: number;
  registration_end: string;
  drive_date: string;
  location: string;
  is_registration_open: boolean;
  is_featured: boolean;
}

interface PlacementOverview {
  overview: {
    active_drives: number;
    open_registrations: number;
    companies_visited: number;
    current_year: number;
  };
}

interface PlacedStudent {
  id: number;
  student_name: string;
  branch: string;
  batch_year: number;
  cgpa: number;
  company_name: string;
  company_logo?: string;
  job_title: string;
  package_lpa: number;
  work_location: string;
  job_type: string;
  offer_date: string;
  is_verified: boolean;
  created_at: string;
}

const PlacementsPage = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [placedStudents, setPlacedStudents] = useState<PlacedStudent[]>([]);
  const [overview, setOverview] = useState<
    PlacementOverview["overview"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"drives" | "placed">("drives");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesResponse, placedResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/drives/`),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/placed-students/`
          ),
        ]);

        const drivesData = await drivesResponse.json();
        const placedData = await placedResponse.json();

        // Handle different response formats
        const drives =
          drivesData.drives || drivesData.results || drivesData || [];
        const placedStudents =
          placedData.placed_students || placedData.results || placedData || [];

        console.log("Placed students data:", placedStudents); // Debug log
        setDrives(drives);
        setPlacedStudents(placedStudents); // Show ALL placed students, not just first 6

        // Calculate companies visited from unique companies in both drives and placed students
        const driveCompanies = drives.map(
          (d: PlacementDrive) => d.company_name
        );
        const placedCompanies = placedStudents.map(
          (p: PlacedStudent) => p.company_name
        );
        const allCompanies = [...driveCompanies, ...placedCompanies];
        const uniqueCompanies = new Set(allCompanies.filter(Boolean));

        // Set overview data
        setOverview({
          active_drives: drives.length,
          open_registrations: drives.filter(
            (d: PlacementDrive) => d.is_registration_open
          ).length,
          companies_visited: uniqueCompanies.size,
          current_year: new Date().getFullYear(),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to mock data
        setDrives([]);
        setPlacedStudents([]);
        setOverview({
          active_drives: 0,
          open_registrations: 0,
          companies_visited: 0,
          current_year: new Date().getFullYear(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getJobTypeColor = (jobType: string) => {
    switch (jobType) {
      case "full_time":
        return "bg-green-100 text-green-800";
      case "internship":
        return "bg-blue-100 text-blue-800";
      case "part_time":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Career Placements
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your gateway to exciting career opportunities and industry
              connections
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Briefcase className="w-8 h-8" />
              <span className="text-lg font-medium">Building Futures</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {overview && (
        <section className="bg-white py-16 -mt-10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="p-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {overview.active_drives}
                  </div>
                  <div className="text-gray-600">Active Drives</div>
                </div>
                <div className="p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {overview.open_registrations}
                  </div>
                  <div className="text-gray-600">Open Registrations</div>
                </div>
                <div className="p-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {overview.companies_visited}
                  </div>
                  <div className="text-gray-600">Companies Visited</div>
                </div>
                <div className="p-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {overview.current_year}
                  </div>
                  <div className="text-gray-600">Current Year</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("drives")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "drives"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Placement Drives
              </button>
              <button
                onClick={() => setActiveTab("placed")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "placed"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Placed Students
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Placed Students Section */}
      {activeTab === "placed" && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Placed Students
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placedStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {student.student_name}
                    </h3>
                    {student.is_verified && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{student.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{student.job_title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IndianRupee className="h-4 w-4" />
                      <span>{student.package_lpa} LPA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{student.work_location}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {student.branch} • {student.batch_year}
                      </span>
                      <span>CGPA: {student.cgpa}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Placed on {formatDate(student.offer_date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Drives */}
      {activeTab === "drives" && (
        <section id="drives-section" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Upcoming Placement Drives
                </h2>
                <p className="text-lg text-gray-600">
                  Don&apos;t miss out on these exciting opportunities
                </p>
              </div>
              <button
                onClick={() => {
                  const drivesSection =
                    document.getElementById("drives-section");
                  drivesSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All Drives
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                  Loading placement drives...
                </p>
              </div>
            ) : drives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map((drive) => (
                  <div
                    key={drive.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {drive.company_logo ? (
                            <Image
                              src={drive.company_logo}
                              alt={drive.company_name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900 truncate max-w-[200px]">
                              {drive.company_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {drive.title}
                            </p>
                          </div>
                        </div>
                        {drive.is_featured && (
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        )}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                              drive.job_type
                            )}`}
                          >
                            {drive.job_type.replace("_", " ").toUpperCase()}
                          </span>
                          {drive.package_lpa && (
                            <div className="flex items-center text-green-600 font-medium">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              {drive.package_lpa} LPA
                            </div>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {drive.location || "Location TBD"}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Drive: {formatDate(drive.drive_date)}
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Registration ends:{" "}
                          {formatDate(drive.registration_end)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {drive.is_registration_open ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Registration Open
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Registration Closed
                          </span>
                        )}

                        <Link
                          href={`/placements/drives/${drive.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Active Drives
                </h3>
                <p className="text-gray-600">
                  Check back soon for new placement opportunities!
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Placement Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link
              href="/placements/companies"
              className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Building className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Company Profiles
              </h3>
              <p className="text-gray-600 mb-4">
                Explore companies that recruit from our campus
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/placements/statistics"
              className="group p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">
                Placement Statistics
              </h3>
              <p className="text-gray-600 mb-4">
                View detailed placement statistics and trends
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                View Statistics
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlacementsPage;
