"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  Briefcase,
  Award,
  MapPin,
  Linkedin,
  Mail,
} from "lucide-react";

interface AlumniMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  mobile_number: string;
  branch: string;
  year_of_passout: number;
  year_of_admission: number;
  current_workplace: string;
  job_title: string;
  current_location: string;
  linkedin_url: string;
  willing_to_mentor: boolean;
  cgpa: number;
}

// Main component function
function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    companies: 0,
    countries: 0,
    years: 0,
  });

  useEffect(() => {
    fetchAlumniData();
  }, []);

  const fetchAlumniData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/core/alumni/`
      );
      const data = await response.json();

      // Handle paginated response format
      const alumni = data.results || data || [];
      setAlumni(alumni);

      // Calculate stats
      const uniqueCompanies = new Set(
        alumni.map((a: AlumniMember) => a.current_workplace).filter(Boolean)
      );
      const uniqueCountries = new Set(
        alumni.map((a: AlumniMember) => a.current_location).filter(Boolean)
      );
      const currentYear = new Date().getFullYear();
      const oldestYear = Math.min(
        ...alumni.map((a: AlumniMember) => a.year_of_passout)
      );

      setStats({
        totalAlumni: alumni.length,
        companies: uniqueCompanies.size,
        countries: uniqueCountries.size,
        years: currentYear - oldestYear + 1,
      });
    } catch (error) {
      console.error("Error fetching alumni data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading alumni data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Alumni Network
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Connecting generations of electrical engineering excellence
            </p>
            <div className="flex items-center justify-center space-x-4">
              <GraduationCap className="w-8 h-8" />
              <span className="text-lg font-medium">Continuing Legacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.totalAlumni}+
                </div>
                <div className="text-gray-600">Alumni Members</div>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.companies}+
                </div>
                <div className="text-gray-600">Companies</div>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.countries}+
                </div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.years}+
                </div>
                <div className="text-gray-600">Years Legacy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Directory */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Alumni
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our distinguished alumni making impact across industries and
              geographies
            </p>
          </div>

          {alumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alumni.map((member) => {
                const baseUrl = (
                  process.env.NEXT_PUBLIC_API_BASE_URL || ""
                ).replace("/api", "");
                const imageUrl =
                  member.image && member.image.startsWith("http")
                    ? member.image
                    : member.image
                    ? `${baseUrl}${member.image}`
                    : `https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`;

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {member.first_name} {member.last_name}
                        </h3>
                        <p className="text-gray-600">{member.job_title}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <a
                          href={`/placements/companies`}
                          className="text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {member.current_workplace}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {member.current_location}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                        {member.branch} - {member.year_of_passout}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        <a
                          href={`mailto:${member.email}`}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      </div>
                      {member.willing_to_mentor && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          Mentor
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Alumni Data Available
              </h3>
              <p className="text-gray-600">
                Alumni directory is being updated. Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Alumni Network</h2>
          <p className="text-xl mb-8 opacity-90">
            Stay connected, give back, and continue your journey with EESA
          </p>
          <div className="flex justify-center">
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Register as Alumni
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Default export
export default AlumniPage;
