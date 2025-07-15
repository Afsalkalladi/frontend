"use client";

import React from "react";
import {
  Users,
  Target,
  Award,
  Heart,
  BookOpen,
  Calendar,
  Briefcase,
  Code,
} from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Faculty Advisor",
      department: "Electrical Engineering",
      image: "/team/sarah-johnson.jpg",
    },
    {
      name: "Alex Chen",
      role: "President",
      year: "Final Year",
      image: "/team/alex-chen.jpg",
    },
    {
      name: "Priya Patel",
      role: "Vice President",
      year: "Third Year",
      image: "/team/priya-patel.jpg",
    },
    {
      name: "Marcus Williams",
      role: "Technical Lead",
      year: "Final Year",
      image: "/team/marcus-williams.jpg",
    },
  ];

  const achievements = [
    {
      year: "2024",
      title: "Best Student Organization Award",
      description:
        "Recognized for outstanding contribution to student development",
    },
    {
      year: "2023",
      title: "Innovation Challenge Winners",
      description: "First place in university-wide innovation competition",
    },
    {
      year: "2023",
      title: "500+ Active Members",
      description: "Reached milestone of 500 active student members",
    },
    {
      year: "2022",
      title: "Digital Platform Launch",
      description: "Successfully launched our comprehensive digital platform",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Digital Library",
      description:
        "Comprehensive collection of study materials, notes, and academic resources.",
    },
    {
      icon: Calendar,
      title: "Events & Workshops",
      description:
        "Regular technical workshops, seminars, and networking events.",
    },
    {
      icon: Briefcase,
      title: "Career Support",
      description:
        "Job placement assistance, internship opportunities, and career guidance.",
    },
    {
      icon: Code,
      title: "Project Showcase",
      description:
        "Platform to showcase innovative projects and collaborate with peers.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EESA</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Empowering the next generation of electrical and electronics
              engineers through collaboration, innovation, and community.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-600">
                To create a vibrant community of electrical and electronics
                engineering students, teachers, and alumni that fosters
                learning, innovation, and professional growth through shared
                knowledge, collaborative projects, and meaningful connections.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600">
                To be the premier platform for electrical engineering education
                and professional development, bridging the gap between academia
                and industry while nurturing the innovators and leaders of
                tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive resources and tools designed to support your
              academic and professional journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated individuals working to make EESA a success for all
              members.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                <p className="text-gray-600 text-sm">
                  {member.department || member.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that mark our journey of growth and impact.
            </p>
          </div>

          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                      {achievement.year}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {achievement.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-200">Study Materials</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-200">Career Placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get Involved
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community and be part of something bigger. Whether you're a
            student, teacher, or alumni, there's a place for you in EESA.
          </p>
          <div className="space-y-4">
            <p className="text-gray-600">
              <strong>Email:</strong> contact@eesa.edu
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> Electrical Engineering Department,
              University Campus
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
