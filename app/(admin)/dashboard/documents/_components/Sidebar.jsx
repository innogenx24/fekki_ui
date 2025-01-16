// app/(admin)/settings/components/Sidebar.jsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaUser,
  FaRegBuilding,
  FaRegAddressCard, 
  FaCity,  
  FaPlusCircle  
} from 'react-icons/fa';

const sidebarLinks = [
  { name: 'Documents', href: '/documents', icon: <FaRegAddressCard /> },

];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('');

  return (
    <aside className="w-50 bg-gray-100 border-r h-full">
      <div className="bg-orange-700 text-white text-center p-4">
        <h1 className="text-lg font-bold">Documents</h1>
      </div>
      <nav className="flex flex-col py-4 space-y-2">
        {/* Loop through the sidebarLinks array to render each link */}
        {sidebarLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            <span
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 text-lg font-medium ${
                activeTab === link.name ? 'bg-indigo-100' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(link.name)}
            >
              {link.icon}
              {link.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
