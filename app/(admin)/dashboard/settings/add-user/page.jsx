'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddUserForm = () => {
    const router = useRouter();
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        roleName: "",
        department: "",
        branch: "",
        emailId: "",
        phoneNumber: "",
        pincode: "",
        country: "",
        state: "",
        city: "",
        landmark: "",
        street: "",
        teamHeadId: "",
        isTeamHead: false,
    });


    const [errors, setErrors] = useState({
        email: "",
        phoneNumber: "",
    });


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Authentication token is missing!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3002/api/customer/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                alert("User created successfully!");
                router.push("/dashboard/settings");
            } else {
                const error = await response.json();

                if (error.message === "Email already exists.") {
                    setErrors({ ...errors, email: "This email is already registered." });
                } else if (error.message === "Phone number already exists.") {
                    setErrors({ ...errors, phoneNumber: "This phone number is already registered." });
                } else {
                    alert(`Error: ${error.message}`);
                }

            }
        } catch (err) {
            console.error("Error while creating user:", err);
            alert("Something went wrong! Please try again.");
        }
    };



    return (
        <div className="flex bg-gray-100 p-8">
            <div className="justify-start bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-4">Add User</h1>
                <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-12 p-6 w-[300%]">
                        {/* Personal Details Section */}
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">First Name*</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Enter First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 p-3"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Last Name*</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Enter Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Username*</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Enter Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Password*</label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Role Name*</label>
                                        <select
                                            name="roleName"
                                            value={formData.roleName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            required
                                        >
                                            <option value="">Select User Role</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Employee">Employee</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Department*</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-3"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required

                                        >
                                            <option value="">Select Department</option>
                                            <option value="Sales">Sales</option>
                                            <option value="HR">HR</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Select Branch*</label>
                                <select className="w-full border border-gray-300 rounded-lg p-3"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Branch</option>
                                    <option value="Branch1">Branch1</option>
                                    <option value="Branch2">Branch2</option>
                                    <option value="Branch3">Branch3</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Email ID*</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Email"
                                            className="w-full border border-gray-300 p-3"
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                                </div>
                                {/* Right Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Mobile Number*</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Mobile Number"
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}

                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Pincode*</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Pincode"
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Country*</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-3"
                                         name="country"
                                         value={formData.country}
                                         onChange={handleChange}
                                         >
                                            <option value="">Select Country</option>
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">State*</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-3"
                                         name="state"
                                         value={formData.state}
                                         onChange={handleChange}
                                         >
                                            <option value="">Select State</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Telangana">Telangana</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Side Fields */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">City*</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-3"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        >
                                            <option value="">Select City</option>
                                            <option value="Bengalore">Bengalore</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Landmark</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Landmark"
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Street</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Address"
                                            className="w-full border border-gray-300 rounded-lg p-3"
                                            name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team Head Section */}
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Head</h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Select Team Head*</label>
                                    <select className="w-full border border-gray-300 rounded-lg p-3"
                                    
                                    name="teamHeadId"
                                    value={formData.teamHeadId}
                                    onChange={handleChange}

                                    >
                                        <option value="">Select Team Head</option>
                                        <option value="1">Jane Smith</option>
                                        <option value="2">John Doe</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <label className="text-sm font-medium text-gray-600">Assign as Team Head</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-3 flex justify-center mt-6">
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

export default AddUserForm;
