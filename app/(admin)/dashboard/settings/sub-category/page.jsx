'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const SubCategoryList = () => {
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState('');
  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/sub-category", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.success) {
          setCategories(result.data);
        } else {
          console.error("Failed to fetch categories:", result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSubCategories();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        // Send DELETE request to the API to remove the sub-category
        const response = await fetch(`http://localhost:3002/api/sub-category/${categoryToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
        if (result.success) {
          // If the deletion is successful, update the state to remove the deleted category
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== categoryToDelete.id)
          );
          setSuccess('Sub-category deleted successfully!');

        } else {
          setError('Failed to delete sub-category.');
        }
      } catch (err) {
        setError('An error occurred while deleting the sub-category.');
      }
    }
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id ? { ...category, active_status: !category.active_status } : category
      )
    );
  };

  const filteredCategories = categories.filter(category =>
    category.sub_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="text-gray-500 justify-left mb-4">
        Master / Sub Category
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Sub Category name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="mb-4">
          <Link href="/dashboard/settings/sub-category/add-sub-category">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Sub Category</button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr className="text-center">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Category Name</th>
              <th className="border border-gray-300 p-2">Sub Category</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr key={category.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{category.category}</td>
                <td className="border border-gray-300 p-2">{category.sub_category}</td>
                <td className="border border-gray-300 p-2">{category.description}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => toggleStatus(category.id)}>
                    {category.active_status ? (
                      <Image src="/images/turnon.png" alt="Active" width={40} height={40} />
                    ) : (
                      <Image src="/images/turnoff.png" alt="Inactive" width={40} height={40} />
                    )}
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center">
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/settings/sub-category/edit-sub-category?id=${category.id}`)}
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
              Are you sure you want to delete the subcategory "
              {categoryToDelete?.sub_category}"?
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

export default SubCategoryList;
