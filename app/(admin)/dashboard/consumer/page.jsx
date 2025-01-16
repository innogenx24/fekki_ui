'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LuImport } from "react-icons/lu";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [token, setToken] = useState('');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve token safely on client side
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch customers from the API
  useEffect(() => {
    if (!token) return; // Ensure token is available

    fetch('http://localhost:3002/api/consumer', {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to the Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setCustomers(data.data);
        } else {
          console.error('Failed to fetch customers:', data);
        }
      })
      .catch((error) => console.error('Error fetching customers:', error));
  }, [token]);

  const toggleStatus = (customerId) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? { ...customer, active_status: customer.active_status ? 0 : 1 }
          : customer
      )
    );
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:3002/api/consumer/${customerToDelete.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setCustomers((prevCustomers) =>
            prevCustomers.filter((customer) => customer.id !== customerToDelete.id)
          );
          setShowModal(false);
        } else {
          console.error('Failed to delete customer');
        }
      })
      .catch((error) => console.error('Error deleting customer:', error));
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-gray-500 justify-left mb-4">
        Master / Consumers
      </div>

      <div className="flex items-center justify-between mb-10">

        {/* <div>
          <select
            className="p-2 border rounded-md ml-[520%] mb-3"
          >
            <option value="">Select All</option>
            <option value="b2b">B2B</option>
            <option value="b2c">B2C</option>
          </select>
        </div> */}

        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%] mb-3"
          />
        </div>

        <div className="mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-10 flex items-center">
            <LuImport className="mr-2" />
            Import Consumers
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => router.push('/dashboard/consumer/create-consumer')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Consumer
          </button>
        </div>

      </div>

      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">No</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers
            .filter((customer) =>
              customer.first_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((customer, index) => (
              <tr key={customer.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{customer.first_name}</td>
                <td className="border border-gray-300 p-2">{customer.email}</td>
                <td className="border border-gray-300 p-2">{customer.mobile_number}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => toggleStatus(customer.id)}>
                    {customer.active_status ? (
                      <Image src="/images/turnon.png" alt="Active" width={40} height={40} />
                    ) : (
                      <Image src="/images/turnoff.png" alt="Inactive" width={40} height={40} />
                    )}
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDeleteClick(customer)}
                      className="text-white px-2 py-1 rounded"
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/consumer/edit-consumer?id=${customer.id}`)}
                    >
                      <Image src="/images/edit.png" alt="Edit" width={40} height={40} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the Consumer "{customerToDelete?.first_name}"?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className="bg-gray-300 text-black px-4 py-2 rounded"
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
