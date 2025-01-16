"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AddRoleForm = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        roleName: "",
        department: "",
        description: "",
    });

    // Fetch the token on the client side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);
        }
    }, []);

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
            const response = await fetch("http://localhost:3002/api/roles/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Role created successfully!");
                router.push("/dashboard/settings/roles");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error while creating role:", err);
            alert("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="flex bg-gray-100 p-8">
            <div className="justify-start bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-4">Add Role</h1>
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-20" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-12 p-6 w-[300%]">
                        {/* Role Details Section */}
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Role Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Role Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="roleName"
                                            value={formData.roleName}
                                            onChange={handleChange}
                                            placeholder="Enter Role Name"
                                            className="w-[80%] border border-gray-300 p-3 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Right Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Department<span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-[80%] border border-gray-300 p-3 rounded-lg"
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Sales">Sales</option>
                                            <option value="HR">HR</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Description Field */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter Role Description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-[80%] border border-gray-300 p-3 rounded-lg"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="col-span-3 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white w-1/2 px-6 py-2 rounded shadow hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoleForm;
