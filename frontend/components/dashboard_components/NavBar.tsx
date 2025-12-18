"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import notificationIcon from '../../public/dashboard_images/notification-bell.png';
import profilePicture from '../../public/dashboard_images/profile-picture.svg';
import { usePathname } from 'next/navigation';
import { userService, UserProfileData } from '@/services/user-service';
import logo from '../../public/landing_page_images/logo.png'
import Link from 'next/link';

const NavBar = () => {
    const pathname = usePathname();
    
    const [user, setUser] = useState<UserProfileData | null>(null);

    useEffect(() => {
        const fetchNavUser = async () => {
            try {
                const response = await userService.getProfile();
                if (response.success) {
                    setUser(response.data);
                }
            } catch (err) {
                // If unauthorized or error, we leave user as null
                console.error("NavBar: Could not fetch user");
                setUser(null);
            }
        };

        fetchNavUser();
    }, []);

    const getPageTitle = (path: string) => {
        if(path === '/dashboard') return 'Overview'
        if(path === '/dashboard/transactions') return 'Transactions'
        if(path === '/dashboard/analytics') return 'Analytics'
        if(path === '/dashboard/budgets') return 'Budgets'
        if(path === '/dashboard/profile') return 'Profile'
        return 'FinanceFlow';
    }

    const headerText = getPageTitle(pathname);

    return (
        <div className='text-[#FFFFFF] flex items-center px-6 sm:px-10 h-full border-b border-b-[#7C3AED]'>
            <Link href='/' className='w-66'>
                <Image src={logo} alt="logo" width={150} height={150} />
            </Link>

            <div className='flex items-center flex-1 justify-between'>
                <h1 className='hidden md:block '>{headerText}</h1>
                
                <div className='flex items-center gap-3 ml-auto'>
                    <Image src={notificationIcon} alt='notification-icon' width={24} height={24} />
                    <Image src={profilePicture} alt='user-profile-picture' width={32} height={32} />
                    
                    <div className='flex flex-col'>
                        {/* Conditional Rendering: Show data if user exists, else show nothing */}
                        <span className='hidden sm:block font-medium sm:text-[12px] lg:text-[16px]'>
                            {user ? `${user.firstName} ${user.lastName}` : ''}
                        </span>
                        <span className='hidden sm:block sm:text-[10px] lg:text-[14px] text-[#94A3B8]'>
                            {user?.email || ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar