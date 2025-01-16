'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

const EditProductType = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = localStorage.getItem("token");
    const productTypeId = searchParams.get("id");

    const [formData, setFormData] = useState({
        product_type: '',
        description: '',
    });

    // Fetch product type details on component mount
    useEffect(() => {
        const fetchProductTypeDetails = async () => {
            if (!token) {
                console.error("Authentication token is missing.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3002/api/product-type/${productTypeId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    // Correctly set the data into the form fields
                    setFormData({
                        product_type: result.data.product_type || '',
                        description: result.data.description || '',
                    });
                } else {
                    const error = await response.json();
                    console.error("Failed to fetch product type details:", error.message);
                }
            } catch (err) {
                console.error("Error fetching product type details:", err);
            }
        };

        if (productTypeId && token) {
            fetchProductTypeDetails();
        }
    }, [productTypeId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Authentication token is missing!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3002/api/product-type/${productTypeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Product Type updated successfully!");
                router.push("/dashboard/settings/product-type");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error updating Product Type:", err);
            alert("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white w-11/12 lg:w-3/4 p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Edit Product Type</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg">
                            <h2 className="text-lg font-medium mb-4">Product Type Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Product Type*</label>
                                    <input
                                        type="text"
                                        name="product_type"
                                        placeholder="Enter Product Type"
                                        value={formData.product_type}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Enter Description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 w-1/2 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductType;
