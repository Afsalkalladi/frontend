"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Building, Award, IndianRupee } from "lucide-react";

interface PlacementStats {
  academic_year: string;
  batch_year: number;
  branch: string;
  total_students: number;
  total_placed: number;
  placement_percentage: number;
  highest_package: number;
  average_package: number;
  median_package: number;
  total_companies_visited: number;
  total_offers: number;
}

interface PlacedStudent {
  id: number;
  student_name: string;
  branch: string;
  batch_year: number;
  company_name: string;
  job_title: string;
  package_lpa: number;
  work_location: string;
  offer_date: string;
}

const PlacementStatisticsPage = () => {
  const [stats, setStats] = useState<PlacementStats[]>([]);
  const [recentPlacements, setRecentPlacements] = useState<PlacedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [statsResponse, placedResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/statistics/`),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/placements/placed-students/`
        ),
      ]);

      const statsData = await statsResponse.json();
      const placedData = await placedResponse.json();

      setStats(statsData.results || statsData || []);
      setRecentPlacements(
        (placedData.results || placedData || []).slice(0, 10)
      );
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentYearStats = () => {
    return stats.find((stat) => stat.academic_year === selectedYear) || null;
  };

  const getAvailableYears = () => {
    return [...new Set(stats.map((stat) => stat.academic_year))]
      .sort()
      .reverse();
  };

  const currentStats = getCurrentYearStats();
  const availableYears = getAvailableYears();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading placement statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Placement Statistics
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Track our placement success and career outcomes
            </p>
            <div className="flex items-center justify-center space-x-4">
              <TrendingUp className="w-8 h-8" />
              <span className="text-lg font-medium">Success Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Year Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedYear === year
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {currentStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Total Students
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentStats.total_students}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Placed
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentStats.total_placed}
              </div>
              <div className="text-sm text-green-600 font-medium">
                {currentStats.placement_percentage.toFixed(1)}% placement rate
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Highest Package
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ₹{currentStats.highest_package} LPA
              </div>
              <div className="text-sm text-gray-600">
                Average: ₹{currentStats.average_package} LPA
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Companies
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {currentStats.total_companies_visited}
              </div>
              <div className="text-sm text-gray-600">
                {currentStats.total_offers} offers received
              </div>
            </div>
          </div>
        )}

        {/* Recent Placements */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Placements
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Branch
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Package
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPlacements.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {student.student_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Batch {student.batch_year}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {student.branch}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {student.company_name}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {student.job_title}
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600">
                      ₹{student.package_lpa} LPA
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {student.work_location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementStatisticsPage;
