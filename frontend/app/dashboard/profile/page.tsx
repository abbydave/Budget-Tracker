'use client'; // Required because we use useEffect and useState

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import profilePicture from '../../../public/dashboard_images/profile-picture.svg';
import { userService, UserProfileData } from '@/services/user-service';

const ProfilePage = () => {
  // State for user data, loading, and errors
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        
        if (response.success) {
          setUser(response.data);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        // Handle common errors (like no token or network issues)
        setError(err.response?.data?.message || "Could not load profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle Loading State
  if (loading) {
    return <div className="p-6 text-white">Loading your profile...</div>;
  }

  // Handle Error State
  if (error) {
    return <div className="p-6 text-red-500 bg-red-500/10 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold'>User Profile</h1>

      <div className='flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl w-full md:w-[400px] p-6 mt-6 rounded-lg'>
        <Image src={profilePicture} alt="Profile Picture" width={100} height={100} className="rounded-full" />
        <div className='flex flex-col'>
          <h1 className='text-2xl font-medium'>{user?.firstName} {user?.lastName}</h1>
          <span className='text-[12px] text-[#94A3B8]'>{user?.email}</span>
          <button className='bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-4 py-2 rounded-lg mt-4 w-fit text-sm'>
            Pro Member
          </button>
        </div>
      </div>

      <div className='bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl w-full md:w-3/4 p-6 mt-6 rounded-lg'>
        <h1 className='text-2xl font-medium mb-4'>Personal Information</h1>

        <label className="block mb-1 text-sm font-light">Full Name</label>
        <input 
          type="text" 
          className='w-full md:w-3/4 lg:w-2/3 mb-4 p-2 rounded-md bg-white/10 border border-white/20 text-white' 
          value={`${user?.firstName} ${user?.lastName}`} 
          readOnly 
        />

        <label className="block mb-1 text-sm font-light">Email Address</label>
        <input 
          type="email" 
          className='w-full md:w-3/4 lg:w-2/3 mb-4 p-2 rounded-md bg-white/10 border border-white/20 text-white' 
          value={user?.email} 
          readOnly 
        />
      </div>

      <div className='flex gap-4 mt-6'>
        <button className='border border-[#7C3AED] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#7C3AED]/10 transition'>
          Log Out
        </button>
        <button className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer transition'>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;