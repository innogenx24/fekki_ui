'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const EditSubCategory = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subCategoryId = searchParams.get('id');
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        category: '',
        sub_category: '',
        description: '',
    });

    const [categories, setCategories] = useState([]);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/category', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    setCategories(result.data || []); // Ensure data is an array
                } else {
                    console.error('Failed to fetch categories:', result.message);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (token) {
            fetchCategories();
        } else {
            console.error('Authentication token is missing.');
        }
    }, [token]);

    // Fetch sub-category details by ID
    useEffect(() => {
        const fetchSubCategoryDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3002/api/sub-category/${subCategoryId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    setFormData({
                        category: result.data.category || '',
                        sub_category: result.data.sub_category || '',
                        description: result.data.description || '',
                    });
                } else {
                    console.error('Failed to fetch sub-category details:', result.message);
                }
            } catch (error) {
                console.error('Error fetching sub-category details:', error);
            }
        };

        if (subCategoryId && token) {
            fetchSubCategoryDetails();
        }
    }, [subCategoryId, token]);

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
            alert('Authentication token is missing!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3002/api/sub-category/${subCategoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Sub-category updated successfully!');
                router.push('/dashboard/settings/sub-category');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error('Error while updating sub-category:', err);
            alert('Something went wrong! Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-left py-10">
            <div className="bg-white w-11/12 lg:w-3/4 p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Edit Sub-Category</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 rounded-lg">
                            <h2 className="text-lg font-medium mb-4">Sub-Category Details</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Category*</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.category}>
                                            {category.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Sub-Category*</label>
                                    <input
                                        type="text"
                                        name="sub_category"
                                        placeholder="Enter Sub-Category Name"
                                        value={formData.sub_category}
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

export default EditSubCategory;
