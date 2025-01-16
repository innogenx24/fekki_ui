'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProductTypeList = () => {
  const router = useRouter();
  const token = localStorage.getItem('token');
  const [productTypes, setProductTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    const fetchProductTypes = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/product-type", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();

        if (result.success) {
          setProductTypes(result.data);
        } else {
          console.error("Failed to fetch product types:", result);
        }
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchProductTypes();
  }, [token]);

  const handleDeleteClick = (productType) => {
    setProductTypeToDelete(productType);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    if (productTypeToDelete) {
      setProductTypes((prevProductTypes) =>
        prevProductTypes.filter((productType) => productType.id !== productTypeToDelete.id)
      );
    }
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setProductTypes((prevProductTypes) =>
      prevProductTypes.map((productType) =>
        productType.id === id ? { ...productType, active_status: !productType.active_status } : productType
      )
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProductTypes = productTypes.filter((productType) =>
    productType.product_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="text-gray-500 justify-left mb-4">
        Master / Product Type
      </div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Product Type Name"
            className="p-2 border rounded-[14px] w-1/5 ml-[60%]"
          />
        </div>
        <div className="mb-4">
          <Link href="/dashboard/settings/product-type/add-product-type">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Product Type</button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs">
            <tr className="text-center">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Product Type Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductTypes.map((productType, index) => (
              <tr key={productType.id} className="text-center">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">{productType.product_type}</td>
                <td className="border border-gray-300 p-2">{productType.description}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => toggleStatus(productType.id)}>
                    {productType.active_status ? (
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
                      onClick={() => handleDeleteClick(productType)}
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>
                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/settings/product-type/edit-product-type?id=${productType.id}`)}
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
              Are you sure you want to delete the product type "{productTypeToDelete?.product_type}"?
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

export default ProductTypeList;
