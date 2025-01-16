'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const RoleList = () => {
  const token = localStorage.getItem('token');
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3002/api/roles", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.success) {
          setRoles(result.data);
        } else {
          console.error("Failed to fetch roles:", result);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleToDelete.id));
    }
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRoles = roles.filter((role) =>
    role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="text-gray-500 justify-left mb-4">Master / Roles</div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Role Name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="mb-4">
          <Link href="/dashboard/settings/roles/add-role">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Role</button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr className="text-center">
                <th className="border border-gray-300 p-2">No</th>
                <th className="border border-gray-300 p-2">Role Name</th>
                <th className="border border-gray-300 p-2">Department</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role, index) => (
                <tr key={role.id} className="text-center">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{role.role_name}</td>
                  <td className="border border-gray-300 p-2">{role.department}</td>
                  <td className="border border-gray-300 p-2">{role.description}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center">
                      <button
                        className="text-white px-2 py-1"
                        onClick={() => handleDeleteClick(role)}
                      >
                        <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                      </button>
                      <button
                        className="text-white px-2 py-1"
                        onClick={() => router.push(`/dashboard/settings/roles/edit-role?id=${role.id}`)}
                      >
                        <Image src="/images/edit.png" alt="Edit" width={40} height={40} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the role "{roleToDelete?.role_name}"?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleList;
