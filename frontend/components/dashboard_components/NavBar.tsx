"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import notificationIcon from '../../public/dashboard_images/notification-bell.png';
import profilePicture from '../../public/dashboard_images/profile-picture.svg';
import { usePathname, useRouter } from 'next/navigation';
import { userService, UserProfileData } from '@/services/user-service';
import logo from '../../public/landing_page_images/logo.png'
import Link from 'next/link';

const NavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNavUser = async () => {
            try {
                // Check if token exists first
                const token = localStorage.getItem("authToken");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await userService.getProfile();
                if (response.success) {
                    setUser(response.data);
                }
            } catch (err) {
                // If unauthorized, clear storage and don't redirect
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchNavUser();
    }, []);

    const handleLogout = async () => {
        await userService.logout();
        router.push("/");
    };

    const getPageTitle = (path: string) => {
        if(path === '/dashboard') return 'Overview'
        if(path === '/dashboard/transactions') return 'Transactions'
        if(path === '/dashboard/analytics') return 'Analytics'
        if(path === '/dashboard/budgets') return 'Budgets'
        if(path === '/dashboard/profile') return 'Profile'
        return 'FinanceFlow';
    }

    const headerText = getPageTitle(pathname);

    if (loading) {
        return <div className="h-16 bg-gray-800 border-b border-gray-700"></div>;
    }

    return (
        <div className='text-[#FFFFFF] flex items-center px-6 sm:px-10 h-full border-b border-b-[#7C3AED]'>
            <Link href='/' className='w-50 sm:w-66'>
                <Image src={logo} alt="logo" width={150} height={150} />
            </Link>

            <div className='flex items-center flex-1 justify-between'>
                <h1 className='hidden md:block '>{headerText}</h1>
                
                <div className='flex items-center gap-3 ml-auto'>
                    <Image src={notificationIcon} alt='notification-icon' width={24} height={24} className='hidden md:block' />
                    <Image src={profilePicture} alt='user-profile-picture' width={32} height={32} className='rounded-full' />
                    
                    <div className='flex flex-col'>
                        {/* Conditional Rendering: Show data if user exists, else show nothing */}
                        <span className='hidden sm:block font-medium sm:text-[12px] lg:text-[16px]'>
                            {user ? `${user.firstName} ${user.lastName}` : ''}
                        </span>
                        <span className='hidden sm:block sm:text-[10px] lg:text-[14px] text-[#94A3B8]'>
                            {user?.email || ''}
                        </span>
                    </div>

                    {user && (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavBar