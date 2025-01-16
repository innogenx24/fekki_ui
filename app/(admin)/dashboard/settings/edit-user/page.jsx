'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation'; 

const AddUserForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        roleName: '',
        department: '',
        branch: '',
        emailId: '',
        phoneNumber: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
        landmark: '',
        street: '',
        teamHeadId: '',
        isTeamHead: false,
        roleBased: 0
    });

    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const fetchClientData = async () => {
            const response = await fetch(`http://localhost:3002/api/customer/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    ...data.data,
                    image: data.data.image || null,
                });
                setIsActive(data.data.status === 1);
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
            }
        };

        if (userId) {
            fetchClientData();
        } else {
            console.log("No client ID found in URL params");
        }
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateUrl = `http://localhost:3002/api/customer/${userId}`;

        const updatedData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            password: formData.password,
            roleName: formData.roleName,
            department: formData.department,
            branch: formData.branch,
            emailId: formData.emailId,
            phoneNumber: formData.phoneNumber,
            pincode: formData.pincode,
            country: formData.country,
            state: formData.state,
            city: formData.city,
            landmark: formData.landmark,
            street: formData.street,
            teamHeadId: formData.teamHeadId,
            isTeamHead: formData.isTeamHead,
            roleBased: formData.roleBased
        };

        try {
            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                console.log("User updated successfully");
                router.push('/dashboard/settings'); 
            } else {
                console.log("Error updating user");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex bg-gray-100 p-8">
            <div className="justify-start bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-4">Edit User</h1>
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-12 p-6 w-[300%]">
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">First Name*</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Last Name*</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Username*</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Password*</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Role Name*</label>
                                        <select
                                            name="roleName"
                                            value={formData.roleName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        >
                                            <option>Manager</option>
                                            <option>Employee</option>
                                            <option>Admin</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Department*</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        >
                                            <option>Sales</option>
                                            <option>HR</option>
                                            <option>Marketing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Select Branch*</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Email ID*</label>
                                        <input
                                            type="text"
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 p-3"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number*</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Pincode*</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Country*</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">State*</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">City*</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Street*</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Landmark*</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Head</h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Select Team Head*</label>
                                    <select
                                        name="teamHead"
                                        value={formData.teamHead}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                    >
                                        <option>Jane Smith</option>
                                        <option>John Doe</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="assignTeamHead"
                                        checked={formData.assignTeamHead}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <label className="text-sm font-medium text-gray-600">Assign as Team Head</label>
                                </div>
                            </div>
                        </div>

                        
                        
                    </div>

                    <div className="col-span-full text-center mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded-lg px-8 py-2 hover:bg-blue-600"
                        >
                            Update User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;
