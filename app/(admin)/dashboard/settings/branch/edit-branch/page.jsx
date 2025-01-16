'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const EditBranch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const branchId = searchParams.get("id");

    const [formData, setFormData] = useState({
        branch_name: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
        address: '',
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (branchId && token) {
            // Fetch branch details
            const fetchBranchDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:3002/api/branch/${branchId}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        const data = result.data; // Access the data object
                        setFormData({
                            branch_name: data.branch_name || '',
                            pincode: data.pincode || '',
                            country: data.country || '',
                            state: data.state || '',
                            city: data.city || '',
                            address: data.address || '',
                        });
                    } else {
                        console.error("Failed to fetch branch details.");
                    }
                } catch (err) {
                    console.error("Error fetching branch details:", err);
                }
            };
    
            fetchBranchDetails();
        }
    }, [branchId, token]);
    

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
            const response = await fetch(`http://localhost:3002/api/branch/${branchId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Branch updated successfully!");
                router.push("/dashboard/settings/branch");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error while updating branch:", err);
            alert("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-left py-10">
            <div className="bg-white w-11/12 lg:w-3/4 p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Edit Branch</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Branch Details */}
                        <div className="p-4 rounded-lg">
                            <h2 className="text-lg font-medium mb-4">Branch Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Branch Name*</label>
                                    <input
                                        type="text"
                                        name="branch_name"
                                        placeholder="Enter Branch Name"
                                        value={formData.branch_name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="p-4 rounded-lg">
                            <h2 className="text-lg font-medium mb-4">Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode*</label>
                                    <input
                                        id="pincode"
                                        name="pincode"
                                        type="text"
                                        placeholder="Enter Pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Country*</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm"
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="West Indies">West Indies</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">State*</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm"
                                        required
                                    >
                                        <option value="">Select State</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Tamilnadu">Tamilnadu</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">City*</label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm"
                                        required
                                    >
                                        <option value="">Select City</option>
                                        <option value="Bengalore">Bengalore</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Chennai">Chennai</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Address*</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Enter Address Name"
                                        value={formData.address}
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

export default EditBranch;
