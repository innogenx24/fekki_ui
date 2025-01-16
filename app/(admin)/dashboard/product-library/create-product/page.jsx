"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function AddProduct() {
    const [productName, setProductName] = useState('');
    const [modelName, setModelName] = useState('');
    const [description, setDescription] = useState('');
    const [productType, setProductType] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subProductType, setsubProductType] = useState('');
    const token = localStorage.getItem("token");
    const router = useRouter();
    const [thumbnail, setThumbnail] = useState(null);
    const [fileDetails, setFileDetails] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const toggleStatus = () => {
        setIsActive((prevStatus) => !prevStatus);
    };

    const handleProductTypeChange = (e) => {
        setProductType(e.target.value);
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:3002/api/category", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();

            if (result.success) {
                setCategories(result.data);
            } else {
                console.error("Failed to fetch categories:", result);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };


    const fetchSubCategories = async () => {
        try {
            const response = await fetch("http://localhost:3002/api/sub-category", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();

            if (result.success) {
                setSubCategories(result.data);
            } else {
                console.error("Failed to fetch subcategories:", result);
            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    // Fetch subcategories when category changes
    useEffect(() => {
        fetchSubCategories();
    }, [token]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('modelName', modelName);
        formData.append('description', description);
        formData.append('productType', productType);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('subProductType', subProductType);
        formData.append('isActive', isActive);

        if (thumbnail) formData.append('thumbnail', thumbnail);
        if (fileDetails) formData.append('fileDetails', fileDetails);

        try {
            const res = await fetch('http://localhost:3002/api/products/create', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                setSuccess('Product created successfully!');
                setError('');
                setProductName('');
                setModelName('');
                setDescription('');
                setProductType('');
                setCategory('');
                setSubCategory('');
                setsubProductType('');
                setThumbnail(null);
                setFileDetails(null);
                setIsActive(true);
                router.push('/dashboard/product-library');
            } else {
                if (data.message === 'Product with the same name already exists.') {
                    setError('Product with the same name already exists.');
                } else {
                    setError('An error occurred while saving the product.');
                }
            }
        } catch (err) {
            setError('An error occurred while saving the product.');
        } finally {
            setLoading(false);
        }
    };



    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileDetails(file);
    };
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="bg-white w-11/12 max-w-6xl mt-8 p-8 rounded-lg shadow-md grid grid-cols-12 gap-6">
                <div className="col-span-5 space-y-4">
                    <h2 className="text-lg font-bold">Product Details:</h2>

                    {/* Product Type Selection */}
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="type"
                                value="B2B"
                                className="form-radio"
                                checked={productType === 'B2B'}
                                onChange={handleProductTypeChange}
                            />
                            <span>B2B</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="type"
                                value="B2C"
                                className="form-radio"
                                checked={productType === 'B2C'}
                                onChange={handleProductTypeChange}
                            />
                            <span>B2C</span>
                        </label>
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block font-medium mb-1">Add Thumbnail</label>
                        <input
                            type="file"
                            id="thumbnail-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                        />
                        <label
                            htmlFor="thumbnail-upload"
                            className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                        >
                            +
                        </label>
                        {thumbnail && (
                            <div className="mt-4">
                                <img
                                    src={URL.createObjectURL(thumbnail)}
                                    alt="Thumbnail"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block font-medium mb-1">Product Name*</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            placeholder="Enter Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>

                        )}
                    </div>

                    {/* Model Name */}
                    <div>
                        <label className="block font-medium mb-1">Model*</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            placeholder="Enter Model Name"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            placeholder="Enter Description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Product Category */}
                    <div>
                        <h2 className="text-lg font-bold mb-2">Product Category:</h2>

                        {/* Category Dropdown */}
                        <div className="col-span-4 space-y-4 mb-2">
                            <label>Category*</label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded-lg"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.category}>
                                        {cat.category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sub-category Dropdown */}
                        <div className="col-span-4 space-y-4">
                            <label>Sub-category*</label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded-lg mb-2"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                            >
                                <option value="">Select Sub-category</option>
                                {subCategories.map((subCat) => (
                                    <option key={subCat.id} value={subCat.sub_category}>
                                        {subCat.sub_category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-span-4 space-y-4">
                    <h2 className="text-lg font-bold">Specifications:</h2>
                    <div>
                        <div className="col-span-4 space-y-4 mb-4">
                            <label>Product Type*</label>
                            <select
                                className="w-full border border-gray-300 p-2 rounded-lg mb-2"
                                value={subProductType}
                                onChange={(e) => setsubProductType(e.target.value)}
                            >
                                <option value="">Select Product type</option>
                                <option value="Explore items">Explore items</option>
                                <option value="Sofas">Exclusive</option>
                            </select>
                        </div>
                        <label className="block font-medium mb-2">File Details</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Upload AR File
                            </label>
                            <span>{fileDetails ? fileDetails.name : 'No File Chosen'}</span>
                        </div>
                    </div>
                </div>

            </div>
            
            <button
                onClick={handleFormSubmit}
                className="bg-blue-500 text-white w-1/2 mt-8 py-2 rounded-lg text-lg"
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Save'}
            </button>
        </div>
    );
}

export default AddProduct;
