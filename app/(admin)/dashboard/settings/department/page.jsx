'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'; 

const DepartmentList = () => {
  const router = useRouter();
  const token = localStorage.getItem('token');
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  // Fetch departments data
  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/department", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.success) {
          setDepartments(result.data);
        } else {
          console.error("Failed to fetch departments:", result);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [token]);

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (departmentToDelete) {
      setDepartments((prevDepartments) =>
        prevDepartments.filter((dept) => dept.id !== departmentToDelete.id)
      );
    }
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter departments based on the search query
  const filteredDepartments = departments.filter((department) =>
    department.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="text-gray-500 justify-left mb-4">
        Master / Department
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} 
            placeholder="Search Department Name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="mb-4">
          <Link href="/dashboard/settings/department/add-department">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Department</button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr className="text-center">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((department, index) => (
              <tr key={department.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{department.department}</td>
                <td className="border border-gray-300 p-2">{department.description}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center">
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => handleDeleteClick(department)}
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/settings/department/edit-department?id=${department.id}`)}
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete the department "
              {departmentToDelete?.department}"?
            </p>
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

export default DepartmentList;
