'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const EditLocationForm = () => {
    const router = useRouter();
    const token = localStorage.getItem("token");
    const searchParams = useSearchParams();
    const locationId = searchParams.get("id");

    const [formData, setFormData] = useState({
        country: "",
        state: "",
        city: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchLocationDetails = async () => {
            if (!token || !locationId) {
                alert("Authentication token or location ID is missing!");
                return;
            }

            try {
                const response = await fetch(`http://localhost:3002/api/location/${locationId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    const data = result.data; // Ensure data is correctly accessed
                    setFormData({
                        country: data.country || "",
                        state: data.state || "",
                        city: data.city || "",
                    });
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (err) {
                console.error("Error fetching location details:", err);
                alert("Something went wrong! Please try again.");
            }
        };

        fetchLocationDetails();
    }, [token, locationId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Authentication token is missing!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3002/api/location/${locationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Location updated successfully!");
                router.push("/dashboard/settings/location");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error while updating location:", err);
            alert("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="flex bg-gray-100 p-8">
            <div className="justify-start bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-4">Edit Location</h1>
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-12 p-6 w-[300%]">
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Location Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Country Name*</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-1/2 border border-gray-300 rounded-lg p-3"
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="West Indies">West Indies</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">State Name*</label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-1/2 border border-gray-300 rounded-lg p-3"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Tamilnadu">Tamilnadu</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">City Name*</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-1/2 border border-gray-300 rounded-lg p-3"
                                            required
                                        >
                                            <option value="">Select City</option>
                                            <option value="Bengalore">Bengalore</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                            <option value="Chenai">Chenai</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-3 flex justify-left mt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white w-1/2 px-6 py-2 rounded shadow hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLocationForm;
