'use client';

import Link from 'next/link';

export default function Menu({ isOpen }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Product Library', href: '/dashboard/product-library' },
    { label: 'Client', href: '/dashboard/client', role: 'Admin' }, // Only show if role is Client
    { label: 'Consumer', href: '/dashboard/consumer' },
    { label: 'Reports', href: '/dashboard/reports' },
  ];

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden sm:flex sm:space-x-8">
        {menuItems.map((menuItem, index) =>
          user?.role_name === menuItem.role || !menuItem.role ? (
            <Link
              key={index}
              href={menuItem.href}
              className="text-black hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer"
            >
              {menuItem.label}
            </Link>
          ) : null
        )}
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden">
        {menuItems.map((menuItem, index) =>
          user?.role_name === menuItem.role || !menuItem.role ? (
            <Link
              key={index}
              href={menuItem.href}
              className="bg-indigo-50 border-indigo-500 text-black block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer"
            >
              {menuItem.label}
            </Link>
          ) : null
        )}
      </div>
    </>
  );
}
