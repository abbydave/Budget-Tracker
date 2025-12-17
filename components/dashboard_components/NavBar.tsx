"use client";

import Image from 'next/image'
import React from 'react'
import notificationIcon from '../../public/dashboard_images/notification-bell.png';
import profilePicture from '../../public/dashboard_images/profile-picture.svg';
import { usePathname } from 'next/navigation';

const NavBar = () => {

    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        if(path === '/dashboard'){
            return 'Overview'
        }
        if(path === '/dashboard/transactions'){
            return 'Transactions'
        }
        if(path === '/dashboard/analytics'){
            return 'Analytics'
        }
        if(path === '/dashboard/budgets'){
            return 'Budgets'
        }
        if(path === '/dashboard/profile'){
            return 'Profile'
        }
    }

    const headerText = getPageTitle(pathname);

  return (
    <div className='text-[#FFFFFF] flex items-center  px-6 sm:px-10 h-full border-b border-b-[#7C3AED]'>
        <div className='w-66'>
            <h1 className='text-2xl font-bold '>FinanceFlow</h1>
        </div>

        <div className='flex  items-center'>
            <h1 className='hidden md:block '>{headerText}</h1>
            
        
            <div className='flex items-center gap-3 absolute right-6 sm:right-10'>
                <Image src={notificationIcon} alt='notification-icon' />
                <Image src={profilePicture} alt='user-profile-picture' className='' />
                <div className='flex flex-col'>
                    <span className='hidden sm:block font-medium sm:text-[12px] lg:text-[16px]'>John Smith</span>
                    <span className='hidden sm:block sm:text-[10px] lg:text-[14px] '>johnsmith@gmail.com</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NavBar