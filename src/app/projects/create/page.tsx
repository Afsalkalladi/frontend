"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Github,
  ExternalLink,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  technologies: z.string().min(1, "At least one technology is required"),
  github_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  live_demo_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const popularTechnologies = [
  "Arduino",
  "Raspberry Pi",
  "MATLAB",
  "Simulink",
  "PCB Design",
  "IoT",
  "Machine Learning",
  "Python",
  "C/C++",
  "FPGA",
  "Power Electronics",
  "Control Systems",
  "Signal Processing",
  "Embedded Systems",
  "Microcontrollers",
  "Sensors",
  "Actuators",
  "RF Design",
  "Antenna Design",
  "VLSI",
  "Digital Design",
];

export default function ProjectCreatePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Update technologies field when selectedTechs changes
  React.useEffect(() => {
    setValue("technologies", selectedTechs.join(", "));
  }, [selectedTechs, setValue]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please log in to create a project.</p>
        </div>
      </div>
    );
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const addTechnology = (tech: string) => {
    if (tech && !selectedTechs.includes(tech)) {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const removeTechnology = (tech: string) => {
    setSelectedTechs(selectedTechs.filter((t) => t !== tech));
  };

  const addCustomTechnology = () => {
    if (customTech.trim()) {
      addTechnology(customTech.trim());
      setCustomTech("");
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (selectedTechs.length === 0) {
      toast.error("Please select at least one technology");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would upload to the server
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("technologies", JSON.stringify(selectedTechs));
      if (data.github_url) formData.append("github_url", data.github_url);
      if (data.live_demo_url)
        formData.append("live_demo_url", data.live_demo_url);
      if (selectedImage) formData.append("image", selectedImage);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Project created successfully!");
      router.push("/"); // Redirect to home or projects page
    } catch (error) {
      console.error("Project creation failed:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Project
          </h1>
          <p className="text-lg text-gray-600">
            Showcase your innovative work to the EESA community and inspire
            others.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your project title"
                  {...register("title")}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
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
                  rows={6}
                  placeholder="Describe your project in detail. What problem does it solve? How does it work? What makes it unique?"
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
                <p className="mt-1 text-sm text-gray-500">
                  {watch("description")?.length || 0}/1000 characters
                </p>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Technologies Used
              </h2>

              {/* Selected Technologies */}
              {selectedTechs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Technologies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechs.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popular Technologies
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularTechnologies.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => addTechnology(tech)}
                      disabled={selectedTechs.includes(tech)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                        selectedTechs.includes(tech)
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Technology */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Custom Technology
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter technology name"
                    value={customTech}
                    onChange={(e) => setCustomTech(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addCustomTechnology())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomTechnology}
                    disabled={!customTech.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Hidden input for form validation */}
              <input type="hidden" {...register("technologies")} />
            </div>

            {/* Links */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Project Links
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* GitHub URL */}
                <div>
                  <label
                    htmlFor="github_url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    GitHub Repository (Optional)
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="github_url"
                      type="url"
                      placeholder="https://github.com/username/repo"
                      {...register("github_url")}
                      className={`pl-10 ${
                        errors.github_url ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.github_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.github_url.message}
                    </p>
                  )}
                </div>

                {/* Live Demo URL */}
                <div>
                  <label
                    htmlFor="live_demo_url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Live Demo (Optional)
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="live_demo_url"
                      type="url"
                      placeholder="https://your-demo.com"
                      {...register("live_demo_url")}
                      className={`pl-10 ${
                        errors.live_demo_url ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.live_demo_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.live_demo_url.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Project Image */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Project Image
              </h2>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">
                      Upload project image
                    </p>
                    <p className="text-sm text-gray-600">
                      Add a visual representation of your project
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    Choose Image
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Project preview"
                    className="w-full max-w-md mx-auto rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || selectedTechs.length === 0}
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
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
