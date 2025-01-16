"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function EditProfile() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userID = searchParams.get("id");
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        loginId: "",
        password: "",
        email: "",
        mobileNumber: "",
        street: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        image: null,
        status: 1,
    });

    const [imagePreview, setImagePreview] = useState(null); // Preview for selected image

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await fetch(`http://localhost:3002/api/client/${userID}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        ...data.data,
                        image: data.data.image || null,
                    });
                    setImagePreview(`http://localhost:3002/uploads/${data.data.image}`);
                } else {
                    console.error("Error fetching data:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (userID) fetchClientData();
    }, [userID, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file)); // Update image preview
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSubmit.append(key, formData[key]);
        });

        try {
            const response = await fetch(`http://localhost:3002/api/client/${userID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSubmit,
            });

            if (response.ok) {
                alert("Profile updated successfully");
                router.push(`/dashboard/profile-details?id=${userID}`);
            } else {
                console.error("Error updating data:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl">
                <div className="text-gray-500 justify-right mb-10">
                    Edit-Profile

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Personal Details:</h3>


                        <div className="flex flex-col items-left space-y-4 mb-6">
                            <h3 className="text-lg font-medium">Edit Image</h3>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile Picture"
                                    width={100}
                                    height={100}
                                    className="rounded-full cursor-pointer"
                                    onClick={() => document.getElementById("imageInput").click()} // Trigger file input click on image click
                                />
                            ) : (
                                <p>No image selected</p>
                            )}

                            {/* Hidden file input */}
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                onChange={handleChangeImage}
                                className="hidden"
                            />
                        </div>

                        {/* Other Input Fields */}
                        <div className="space-y-4 grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label>First Name*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <label>Last Name*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <label>Login ID*</label>
                                <input
                                    type="text"
                                    name="loginId"
                                    value={formData.loginId}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label>Password*</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                                <label>Phone Number*</label>
                                <input
                                    type="tel"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>


                    </div>

                    {/* Address Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Address:</h3>

                        <label>Country*</label>
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Country</option>
                            {/* Add country options here */}
                            <option value="USA">USA</option>
                            <option value="India">India</option>
                            <option value="Canada">Canada</option>
                        </select>

                        <label>State*</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select State</option>
                            {/* Add state options here */}
                            <option value="California">California</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="New York">New York</option>
                        </select>

                        <label>City*</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select City</option>
                            {/* Add city options here */}
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="New York City">New York City</option>
                            <option value="Bengalore">Bengalore</option>
                        </select>

                        <label>Street*</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <label>Pincode*</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                </div>
                <div className="flex justify-center mt-6">
                    <button type="submit" className="w-1/2 bg-blue-500 text-white p-2 rounded">
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
