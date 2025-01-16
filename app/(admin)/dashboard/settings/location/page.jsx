'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const LocationList = () => {
  const token = localStorage.getItem('token');
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/location", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.success) {
          setLocations(result.data);
        } else {
          console.error("Failed to fetch locations:", result);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [token]);

  const handleDeleteClick = (location) => {
    setLocationToDelete(location);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (locationToDelete) {
      setLocations((prevLocations) =>
        prevLocations.filter((loc) => loc.id !== locationToDelete.id)
      );
    }
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  // Search handler function
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter locations based on search query
  const filteredLocations = locations.filter((location) =>
    location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="text-gray-500 justify-left mb-4">
        Master / Location
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange} 
            placeholder="Search Country or State or City"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="mb-4">
          <Link href="/dashboard/settings/location/add-location">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Location</button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr className="text-center">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Country</th>
              <th className="border border-gray-300 p-2">State</th>
              <th className="border border-gray-300 p-2">City</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations.map((location, index) => (
              <tr key={location.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{location.country}</td>
                <td className="border border-gray-300 p-2">{location.state}</td>
                <td className="border border-gray-300 p-2">{location.city}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => toggleStatus(location.id)}>
                    {location.active_status ? (
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
                      onClick={() => handleDeleteClick(location)}
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/settings/location/edit-location?id=${location.id}`)}
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
              Are you sure you want to delete the location "
              {locationToDelete?.country}, {locationToDelete?.state}, {locationToDelete?.city}"?
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

export default LocationList;
