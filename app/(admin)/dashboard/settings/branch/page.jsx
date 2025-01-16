'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const BranchList = () => {
  const router = useRouter();
  const token = localStorage.getItem('token');
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/branch", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.success) {
          setBranches(result.data);
        } else {
          console.error("Failed to fetch branches:", result);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, [token]);

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (branchToDelete) {
      setBranches((prevBranches) =>
        prevBranches.filter((b) => b.id !== branchToDelete.id)
      );
    }
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setBranches((prevBranches) =>
      prevBranches.map((b) =>
        b.id === id ? { ...b, active_status: !b.active_status } : b
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBranches = branches.filter(branch => {
    return branch.branch_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-4">
      <div className="text-gray-500 justify-left mb-4">
        Master / Branches
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Branch name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="mb-4">
          <Link href="/dashboard/settings/branch/add-branch">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Branch</button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
          <thead className="bg-gray-100 text-gray-700  text-xs">
            <tr className="text-center">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Branch Name</th>
              <th className="border border-gray-300 p-2">Country</th>
              <th className="border border-gray-300 p-2">State</th>
              <th className="border border-gray-300 p-2">City</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranches.map((branch, index) => (
              <tr key={branch.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{branch.branch_name}</td>
                <td className="border border-gray-300 p-2">{branch.country}</td>
                <td className="border border-gray-300 p-2">{branch.state}</td>
                <td className="border border-gray-300 p-2">{branch.city}</td>
                <td className="border border-gray-300 p-2">{branch.address}, {branch.pincode}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => toggleStatus(branch.id)}>
                    {branch.active_status ? (
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
                      onClick={() => handleDeleteClick(branch)}
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/settings/branch/edit-branch?id=${branch.id}`)}
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
              Are you sure you want to delete the branch "
              {branchToDelete?.branch_name}"?
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

export default BranchList;
