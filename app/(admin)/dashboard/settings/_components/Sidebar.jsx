'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const sidebarLinks = [
  { name: 'User', href: '/dashboard/settings', imagePath: '/setting-images/user.png' },
  { name: 'Roles', href: '/dashboard/settings/roles', imagePath: '/setting-images/roles.png' },
  { name: 'Department', href: '/dashboard/settings/department', imagePath: '/setting-images/department.png' },
  { name: 'Locations', href: '/dashboard/settings/location', imagePath: '/setting-images/location.png' },
  { name: 'Branches', href: '/dashboard/settings/branch', imagePath: '/setting-images/branch.png' },
  { name: 'Category', href: '/dashboard/settings/category', imagePath: '/setting-images/category.png' },
  { name: 'Sub Category', href: '/dashboard/settings/sub-category', imagePath: '/setting-images/sub-category.png' },
  { name: 'Product Type', href: '/dashboard/settings/product-type', imagePath: '/setting-images/product-type.png' },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('User'); // Default active tab set to "User"

  useEffect(() => {
    // Ensure "User" tab is active on initial render
    setActiveTab('User');
  }, []);

  return (
    <aside className="w-50 bg-gray-100 border-r">
      <nav className="flex flex-col">
        {sidebarLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            <span
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 text-lg font-medium ${activeTab === link.name ? 'bg-white-200' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab(link.name)}
            >
              <div
                className={`p-2 ${activeTab === link.name ? 'bg-black' : 'bg-transparent'} rounded-[14px]`}
              >
                <Image
                  src={link.imagePath}
                  alt={`${link.name} icon`}
                  width={80}
                  height={50}
                />
              </div>
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
