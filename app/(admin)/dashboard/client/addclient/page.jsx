'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorForm() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [isActive, setIsActive] = useState(true);

  
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


  const [errors, setErrors] = useState({
    mobileNumber: '',
    email: '',
  });

  // Retrieve token when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const toggleStatus = () => {
    setIsActive((prev) => !prev);
  };

   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '', 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the file
    if (file) {
      setFormData({
        ...formData,
        image: file, // Store the file object in formData
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
      const response = await fetch('http://localhost:3002/api/client/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Add the token here
        },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Client Created:', result);
        router.push('/dashboard/client');
      } else {
        const error = await response.json();
        console.error('Error creating client:', error);

        // Set specific field errors
        if (error.message === 'Mobile number already exists.') {
          setErrors((prevErrors) => ({ ...prevErrors, mobileNumber: error.message }));
        }
        if (error.message === 'Email already exists.') {
          setErrors((prevErrors) => ({ ...prevErrors, email: error.message }));
        }
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An unexpected error occurred. Please try again later.');
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
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="image-upload"
                  className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  +
                </label>
                {formData.image && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Selected Image"
                      className="w-32 h-32 object-cover rounded-md"
                    />
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
                  className={`w-full border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-gray-800`}
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter Mobile Number"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 text-gray-800`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                <label className="block text-gray-600 font-medium mb-1">Street Name*</label>
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
            <div>
              <label className="block text-gray-600 font-medium mb-1">Landmark*</label>
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
          </form>
        </div>

        {/* Right Section: Status */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Inactive</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={isActive}
                onChange={toggleStatus}
              />
              <span className="w-11 h-6 bg-gray-200 rounded-full flex items-center justify-start p-1 transition-all duration-300 ease-in-out">
                <span
                  className={`${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  } w-4 h-4 bg-blue-500 rounded-full transition-transform duration-300 ease-in-out`}
                ></span>
              </span>
            </label>
            <span className="ml-2 text-gray-600">Active</span>
          </div>
        </div> */}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md w-1/3"
        >
          Save
        </button>
      </div>

    </div>
  );
}
