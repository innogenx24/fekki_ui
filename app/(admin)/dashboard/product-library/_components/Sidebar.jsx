// app/(admin)/settings/components/Sidebar.jsx

'use client';

import Link from 'next/link';
import { useState,useEffect} from 'react';

import Image from 'next/image';

const sidebarLinks = [
  { name: 'Product List', href: '/dashboard/product-library', imagePath: '/setting-images/productList.png' },

];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('Product List');

  useEffect(() => {
    // Ensure "User" tab is active on initial render
    setActiveTab('Product List');
  }, []);

  return (
    <aside className="w-50 bg-gray-100 border-r h-full">
      {/* <div className="bg-orange-700 text-white text-center p-4">
        <h1 className="text-lg font-bold">Products</h1>
      </div> */}
      <nav className="flex flex-col py-4 space-y-2">
        {/* Loop through the sidebarLinks array to render each link */}
        {sidebarLinks.map((link) => (
          <Link key={link.name} href={link.href}>
             <span
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 text-lg font-medium ${activeTab === link.name ? 'bg-white-200' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab(link.name)}
            >
              <div
                className={`p-1 ${activeTab === link.name ? 'bg-black' : 'bg-transparent'} rounded-[14px] w-full`} // Set width to 100% or another value
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
