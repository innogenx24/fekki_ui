"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const EditRoleForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleId = searchParams.get('id');
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        department: "",
        description: "",
    });

    // Fetch the token from localStorage and roleId from the query params
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
        if (roleId && storedToken) {
            fetchRoleDetails(roleId, storedToken);
        }
    }, [roleId]); // Only rerun when roleId changes

    // Fetch role details for editing
    const fetchRoleDetails = async (roleId, token) => {
        try {
            const response = await fetch(`http://localhost:3002/api/roles/${roleId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    department: data.data.department,
                    description: data.data.description,
                });
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error fetching role details:", err);
            alert("Something went wrong! Please try again.");
        }
    };

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
            const response = await fetch(`http://localhost:3002/api/roles/${roleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Role updated successfully!");
                router.push("/dashboard/settings/roles");
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error("Error while updating role:", err);
            alert("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="flex bg-gray-100 p-8">
            <div className="justify-start bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-4">Edit Role</h1>
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-20" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-12 p-6 w-[300%]">
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Role Details</h2>
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Role Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department || ""}
                                            onChange={handleChange}
                                            placeholder="Enter Department Name"
                                            className="w-1/2 border border-gray-300 p-3 rounded-lg"
                                            required
                                        />
                                    </div>
                                </div>
                               
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter Role Description"
                                        value={formData.description || ""}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-1/2 border border-gray-300 p-3 rounded-lg"
                                    ></textarea>
                                </div>
                        </div>
                    </div>
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

export default EditRoleForm;
