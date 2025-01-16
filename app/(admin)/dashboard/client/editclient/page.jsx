'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EditClientForm() {
    const [isActive, setIsActive] = useState(true);
    const token = localStorage.getItem("token");
    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        clientId: '',
        clientBrand: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        loginId: '',
        password: '',
        country: '',
        state: '',
        city: '',
        street: '',
        landmark: '',
        pincode: '',
        image: null,
    });

    const searchParams = useSearchParams();
    const clientId = searchParams.get('id');
    const router = useRouter();  // Initialize the router for navigation
    
    useEffect(() => {
        const fetchClientData = async () => {
            // Ensure the token is included in the Authorization header
            const response = await fetch(`http://localhost:3002/api/client/${clientId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token here
                    'Content-Type': 'application/json', // Specify the content type if necessary
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
                console.error("Error fetching data:", response.status, response.statusText); // Handle error if response isn't OK
            }
        };

        if (clientId) {
            fetchClientData();
        } else {
            console.log("No client ID found in URL params");
        }
    }, [clientId, token]);

    const toggleStatus = () => {
        setIsActive((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'image' && formData.image) {
                data.append('image', formData.image);
            } else {
                data.append(key, formData[key]);
            }
        });
        data.append('status', isActive ? 1 : 0);

        try {
            const response = await fetch(`http://localhost:3002/api/client/${clientId}`, {
                method: 'PUT',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                router.push('/dashboard/client');
            } else {
                const errorData = await response.json();
                if (errorData.success === false) {
                    // Populate error messages in the state
                    setFormErrors((prevErrors) => ({
                        ...prevErrors,
                        mobileNumber: errorData.message.includes('Mobile number') ? errorData.message : '',
                        email: errorData.message.includes('Email') ? errorData.message : '',
                    }));
                }
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Side: Client Details and Point of Contact */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Client Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Add Image Section */}
                            <div>
                                <label className="block font-medium mb-1">Add Image</label>
                                <input
                                    type="file"
                                    id="image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange} // Call handleImageChange when a file is selected
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                                >
                                    +
                                </label>
                                {formData.image instanceof File ? (
                                    <div className="mt-4">
                                        {/* Display the selected image */}
                                        <img
                                            src={URL.createObjectURL(formData.image)} // Display the selected image using object URL
                                            alt="Selected Image"
                                            className="w-32 h-32 object-cover rounded-md"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        {/* Display the image from the API */}
                                        {formData.image ? (
                                            <img
                                                src={`http://localhost:3002/uploads/${formData.image}`}
                                                className="w-32 h-32 object-cover rounded-md"
                                            />
                                        ) : (
                                            <span className="text-gray-500">No image available</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Client ID*</label>
                                <input
                                    type="text"
                                    name="clientId"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.clientId}
                                    onChange={handleChange}
                                    placeholder="0010"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Client/Brand*</label>
                                <input
                                    type="text"
                                    name="clientBrand"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.clientBrand}
                                    onChange={handleChange}
                                    placeholder="Client/Brand Name"
                                />
                            </div>
                        </div>

                        <h2 className="text-lg font-medium text-gray-800 mb-4">Point of Contact</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">First Name*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter First Name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Last Name*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter Last Name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Mobile Number*</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Mobile Number"
                                />
                                {formErrors.mobileNumber && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.mobileNumber}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`w-full border rounded-md px-3 py-2 ${
                                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter Email"
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Login ID*</label>
                                <input
                                    type="text"
                                    name="loginId"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.loginId}
                                    onChange={handleChange}
                                    placeholder="Enter Login ID"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Password*</label>
                                <input
                                    type="text"
                                    name="password"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Middle Section: Address */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Address</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Country*</label>
                                <input
                                    type="text"
                                    name="country"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Enter Country"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">State*</label>
                                <input
                                    type="text"
                                    name="state"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter State"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">City*</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter City"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Street*</label>
                                <input
                                    type="text"
                                    name="street"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="Enter Street"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="Enter Landmark"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 font-medium mb-1">Pincode*</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Enter Pincode"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Side: Status */}
                {/* <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Client Status</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={toggleStatus}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-600">Active</span>
                    </div>
                </div> */}
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md w-1/2"
                >
                    Save Changes
                </button>
            </div>

        </div>
    );
}
