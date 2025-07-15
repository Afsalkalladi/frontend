"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BookOpen, Calendar, Briefcase, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  registration_required: boolean;
  max_participants: number;
  is_upcoming: boolean;
  is_registration_open: boolean;
  registration_count: number;
  spots_remaining: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/events/`
        );
        if (response.ok) {
          const data = await response.json();
          const eventsArray = data.results || [];
          // Get only upcoming events, limit to 6
          const upcomingEvents = eventsArray
            .filter((event: Event) => event.is_upcoming)
            .slice(0, 6);
          setEvents(upcomingEvents);
        } else {
          console.error('Failed to fetch events:', response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const features = [
    {
      icon: BookOpen,
      title: "Digital Library",
      description:
        "Access and share notes, study materials, and academic resources with your peers.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Calendar,
      title: "Events & Workshops",
      description:
        "Stay updated with upcoming events, workshops, and seminars in the EE community.",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Briefcase,
      title: "Career Opportunities",
      description:
        "Discover internships, job openings, and career guidance from industry professionals.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Users,
      title: "Community Projects",
      description:
        "Collaborate on innovative projects and showcase your work to the community.",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "1000+", label: "Study Materials" },
    { number: "50+", label: "Events Hosted" },
    { number: "200+", label: "Career Placements" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">EESA</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              The premier platform for Electrical and Electronics Engineering
              students, teachers, and alumni to connect, collaborate, and grow
              together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Browse Events
                </Button>
              </Link>
              <Link href="/academics">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Academic Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover all the tools and resources designed to enhance your
              academic and professional journey in electrical engineering.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
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

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us for workshops, seminars, and competitions designed to enhance your skills and knowledge.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="relative">
              <div className="overflow-x-auto">
                <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-lg border hover:shadow-xl transition-shadow flex-shrink-0 w-80"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {event.title}
                          </h3>
                          {event.registration_required && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Registration Required
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {formatDate(event.start_date)}
                              {event.start_date !== event.end_date &&
                                ` - ${formatDate(event.end_date)}`}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              {formatTime(event.start_date)} - {formatTime(event.end_date)}
                            </span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>

                          {event.max_participants && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-2" />
                              <span>
                                {event.registration_count || 0} / {event.max_participants} participants
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t">
                          <Link href="/events">
                            <Button className="w-full" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Link href="/events">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View All Events
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No upcoming events
              </h3>
              <p className="text-gray-600">
                Check back later for new events and workshops.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore EESA?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect with the community, access resources, and stay updated with
            the latest events.
          </p>
          <Link href="/events">
            <Button size="lg" variant="secondary">
              Explore Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
