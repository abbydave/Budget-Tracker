"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import clsx from 'clsx';
import dashboardIcon from '../../public/dashboard_images/dashboard-icon.png';
import transactionsIcon from '../../public/dashboard_images/transactions-icon.png';
import budgetIcon from '../../public/dashboard_images/budget-icon.png';
import analyticsIcon from '../../public/dashboard_images/analytics-icon.png';
import profileIcon from '../../public/dashboard_images/profile-icon.png';



const NavLinks = () => {

    const pathname = usePathname();

  const links = [
  { name: 'Dashboard', href: '/dashboard', icon: dashboardIcon },
  { name: 'Transactions', href: '/dashboard/transactions', icon: transactionsIcon },
  { name: 'Categories', href: '/dashboard/categories', icon: dashboardIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: analyticsIcon },
  { name: 'Budgets', href: '/dashboard/budgets', icon: budgetIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: profileIcon },
];


  return (
    <>

    {/* Mobile view */}
    <div className='flex md:hidden grow items-center'>
        {links.map((link) => {
        
        return(
            <Link
            key={link.name}
            href={link.href}
            className={clsx(
              ' py-6 text-[12px] font-normal w-full flex justify-center',
              {
                'bg-[#1E1F23] border-b-4 border-b-[#7C3AED]': pathname === link.href,
              },
            )}
          >
            <Image src={link.icon} alt='nav-icons'
            width={24}
            height={24}
            style={{ filter: pathname === link.href ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(337deg) brightness(104%) contrast(104%)' : 'invert(70%) sepia(6%) saturate(529%) hue-rotate(179deg) brightness(93%) contrast(86%)' }}
            />
            
          </Link>
        );
    })}
    </div>


    {/* Desktop view */}
    <div className='bg-[#1F2937] mt-0 md:mt-6 rounded-xl w-5/6 mx-auto'>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'hidden md:flex h-12 grow items-center justify-center gap-2 p-3 text-[14px] font-normal  text-[#8B97B4] hover:bg-[#1E1F23] hover:text-[#FFFFFF] md:flex-none md:justify-start md:py-10 md:px-6',
              {
                'bg-[#1E1F23] text-[#FFFFFF] border-l-4 border-l-[#7C3AED]': pathname === link.href,
              },
            )}
          >
            <Image src={link.icon} alt='nav-icons'
            style={{ filter: pathname === link.href ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(337deg) brightness(104%) contrast(104%)' : 'invert(70%) sepia(6%) saturate(529%) hue-rotate(179deg) brightness(93%) contrast(86%)' }}
            width={24}
            height={24}
             />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </div>
    </>
  )
}

export default NavLinks



