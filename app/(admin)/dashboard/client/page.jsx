'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function VendorList() {
  const router = useRouter();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch vendors from the API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/client', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        if (result.success) {
          setVendors(result.data);
          setFilteredVendors(result.data); // Initialize filtered vendors
        } else {
          console.error("Error retrieving vendors:", result.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchVendors();
  }, [token]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = vendors.filter((vendor) =>
      `${vendor.firstName} ${vendor.lastName}`.toLowerCase().includes(query)
    );
    setFilteredVendors(filtered);
  };

  // Toggle status handler
  const toggleStatus = async (id) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === id ? { ...vendor, status: vendor.status ? 0 : 1 } : vendor
    );
    setVendors(updatedVendors);

    try {
      const response = await fetch(`http://localhost:3002/api/client/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: updatedVendors.find((v) => v.id === id).status }),
      });
      if (!response.ok) {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Delete functionality
  const handleDeleteClick = (user) => {
    setCustomerToDelete(user);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/client/${customerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setVendors((prevVendors) =>
          prevVendors.filter((vendor) => vendor.id !== customerToDelete.id)
        );
        setFilteredVendors((prevFiltered) =>
          prevFiltered.filter((vendor) => vendor.id !== customerToDelete.id)
        );
        setShowModal(false);
        setCustomerToDelete(null);
      } else {
        console.error("Error deleting vendor:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-gray-500 justify-left mb-4">
        Clients List
      </div>


      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Client Name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="ml-4">
          <button
            onClick={() => router.push('/dashboard/client/addclient')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Client
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-left text-sm font-semibold">
            <th className="border border-gray-300 px-4 py-3 text-center">No</th>
            <th className="border border-gray-300 px-4 py-3">Client Name</th>
            <th className="border border-gray-300 px-4 py-3 text-center">Email ID</th>
            <th className="border border-gray-300 px-4 py-3 text-center">Mobile No</th>
            <th className="border border-gray-300 px-4 py-3 text-center">Brand</th>
            <th className="border border-gray-300 px-4 py-3 text-center">Status</th>
            <th className="border border-gray-300 px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((user, index) => (
            <tr key={user.id} className="border-b">
              <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 p-2 text-center">
                {user.image ? (
                  <div className="flex items-center justify-start">
                    <img
                      src={`http://localhost:3002/uploads/${user.image}`}
                      className="w-12 h-12 object-cover rounded-full mr-2"
                    />
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-start">
                    <img
                      src="path/to/default-image.jpg"
                      className="w-12 h-12 object-cover rounded-full mr-2"
                    />
                    <span>No image</span>
                  </div>
                )}
              </td>


              <td className="border border-gray-300 p-2 text-center">{user.email}</td>
              <td className="border border-gray-300 p-2 text-center">{user.mobileNumber}</td>
              <td className="border border-gray-300 p-2 text-center">{user.clientBrand}</td>
              <td className="border border-gray-300 p-2">
                <div className="flex justify-center items-center h-full">
                  <button onClick={() => toggleStatus(user.id)}>
                    {user.status ? (
                      <Image src="/images/turnon.png" alt="Active" width={40} height={40} />
                    ) : (
                      <Image src="/images/turnoff.png" alt="Inactive" width={40} height={40} />
                    )}
                  </button>
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex justify-center">
                  <button
                    className="text-white px-2 py-1"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                  </button>
                  <button
                    className="text-white px-2 py-1"
                    onClick={() => router.push(`/dashboard/client/editclient?id=${user.id}`)}
                  >
                    <Image src="/images/edit.png" alt="Edit" width={40} height={40} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the client "{customerToDelete?.firstName} {customerToDelete?.lastName}"?</p>
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
}
