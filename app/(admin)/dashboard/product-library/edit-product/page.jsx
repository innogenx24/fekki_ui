"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function EditProduct() {
    const [productName, setProductName] = useState('');
    const [modelName, setModelName] = useState('');
    const [description, setDescription] = useState('');
    const [productType, setProductType] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [subProductType, setsubProductType] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [fileDetails, setFileDetails] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const token = localStorage.getItem("token");


    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await fetch(`http://localhost:3002/api/products/${productId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Add the token here
                    },
                });

                const data = await res.json();
                if (data.success) {
                    const product = data.data; // Access product data correctly
                    setProductName(product.productName);
                    setModelName(product.modelName);
                    setDescription(product.description);
                    setProductType(product.productType);
                    setCategory(product.category);
                    setSubCategory(product.subCategory);
                    setsubProductType(product.subProductType);

                    setIsActive(product.isActive);
                    // Set the image and file if present
                    if (product.thumbnail) setThumbnail(`http://localhost:3002/uploads/${product.thumbnail}`);
                    if (product.fileDetails) setFileDetails(product.fileDetails);
                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                setError('Failed to fetch product data.');
            }
        };

        fetchProductData();
    }, [productId]);

    const toggleStatus = () => {
        setIsActive((prevStatus) => !prevStatus);
    };

    const handleProductTypeChange = (e) => {
        setProductType(e.target.value);
    };
    

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
            const res = await fetch(`http://localhost:3002/api/products/${productId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token
                }
            });

            const data = await res.json();

            if (data.success) {
                setSuccess('Product updated successfully!');
                setError('');
                router.push('/dashboard/product-library');
            } else {
                // Check for specific error message
                if (data.message === "Another product with the same name already exists.") {
                    setError('Product with the same name already exists. Please choose a different name.');
                } else {
                    setError('Failed to update product.');
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
        setFileDetails(file); // Store the file object directly
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file); // Store the file object directly
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            {/* Main Content */}
            <div className="bg-white w-11/12 max-w-6xl mt-8 p-8 rounded-lg shadow-md grid grid-cols-12 gap-6">
                {/* Product Details */}
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
                        {thumbnail && typeof thumbnail === 'string' ? (
                            <div className="mt-4">
                                <img
                                    src={thumbnail}
                                    alt="Thumbnail"
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>
                        ) : (
                            thumbnail && thumbnail instanceof File && (
                                <div className="mt-4">
                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt="Thumbnail"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                </div>
                            )
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
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>

                    )}
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
                    <div className="col-span-5 space-y-4">
                        <h2 className="text-lg font-bold">Product Category:</h2>

                        {/* Category Dropdown */}
                        <div className="col-span-5 space-y-4">
                            <label>Category*</label>
                            <select
                                className="w-full border p-2 rounded-lg"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Home Items">Home Items</option>
                                <option value="Kitchen Items">Kitchen Items</option>
                                <option value="Tech">Tech</option>
                            </select>
                        </div>

                        {/* Sub-category Dropdown */}
                        <div className="col-span-5 space-y-4">
                            <label>Sub-category*</label>
                            <select
                                className="w-full border p-2 rounded-lg"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                            >
                                <option value="">Select Sub-category</option>
                                <option value="Mobile Phones">Mobile Phones</option>
                                <option value="Sofas">Sofas</option>
                                <option value="ELECTRIC">ELECTRIC</option>


                            </select>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="col-span-4 space-y-4">
                    <h2 className="text-lg font-bold">Specifications:</h2>
                    <div>
                        <label className="block font-medium mb-1">Product Type*</label>
                        <select
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            value={subProductType}
                            onChange={handleProductTypeChange}
                        >
                            <option value="Exclusive">Exclusive</option>
                            <option value="Standard">Standard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">File Details</label>
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

            

            {/* Save Button */}
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

export default EditProduct;
