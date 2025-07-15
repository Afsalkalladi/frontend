"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, Image as ImageIcon, Calendar, Users } from "lucide-react";

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  event_name: string;
  event_date: string;
  location: string;
  photographer: string;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
}

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/images/`
      );
      const data = await response.json();
      // Handle paginated response format
      setImages(data.results || []);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to construct proper image URLs
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg"; // fallback image

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const cleanBaseUrl = baseUrl.replace("/api", "");
    const cleanImagePath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

    return `${cleanBaseUrl}${cleanImagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading gallery...</div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Photo Gallery
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Capturing moments, preserving memories of our academic journey
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Camera className="w-8 h-8" />
                <span className="text-lg font-medium">Visual Stories</span>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <ImageIcon className="w-24 h-24 text-gray-300 mx-auto mb-8" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Gallery Coming Soon
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We&apos;re working on building an amazing gallery to showcase
                our events, activities, and memorable moments. Stay tuned for
                updates!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Event Photos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Technical events, cultural programs, and academic activities
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Student Life
                  </h3>
                  <p className="text-sm text-gray-600">
                    Campus life, student activities, and memorable moments
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Achievements
                  </h3>
                  <p className="text-sm text-gray-600">
                    Awards, recognitions, and milestone celebrations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // If we have images, show the gallery
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Capturing moments, preserving memories of our academic journey
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Camera className="w-8 h-8" />
              <span className="text-lg font-medium">Visual Stories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => {
              const imageUrl = getImageUrl(image.image);

              return (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={imageUrl}
                      alt={image.title || "Gallery image"}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-300 group-hover:scale-110"
                      unoptimized={true} // Disable Next.js optimization for external URLs
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 truncate">
                      {image.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">
                      {image.description}
                    </p>
                    {image.event_name && (
                      <p className="text-xs text-purple-600 font-medium mb-1">
                        Event: {image.event_name}
                      </p>
                    )}
                    {image.location && (
                      <p className="text-xs text-gray-500">
                        Location: {image.location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
