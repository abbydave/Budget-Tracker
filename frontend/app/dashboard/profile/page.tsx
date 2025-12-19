"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import profilePicture from "../../../public/dashboard_images/profile-picture.svg";
import { userService, UserProfileData } from "@/services/user-service";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        if (response.success) {
          setUser(response.data);
          setFormData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
          });
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        setError("Failed to load profile. Please log in again.");
        setTimeout(() => router.push("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setUpdating(true);

    try {
      const response = await userService.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      });

      if (response.success) {
        setUser(response.data);
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await userService.logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="p-6 text-white text-center">
        Loading your profile...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="p-6 text-red-500 bg-red-500/10 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">User Profile</h1>

      {/* Profile Card */}
      <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl w-full p-6 rounded-lg">
        <Image
          src={profilePicture}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium text-white">
            {user?.firstName} {user?.lastName}
          </h1>
          <span className="text-[12px] text-[#94A3B8]">{user?.email}</span>
          <button className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-4 py-2 rounded-lg mt-4 w-fit text-sm hover:opacity-90 transition">
            Pro Member
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl w-full p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-white">
            Personal Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#7C3AED] hover:underline text-sm"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-400 mb-4">{success}</p>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2 rounded-lg transition disabled:opacity-50 font-medium"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-400">
                Full Name
              </label>
              <p className="text-white">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-400">
                Email Address
              </label>
              <p className="text-white">{user?.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="border border-red-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600/10 transition text-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
