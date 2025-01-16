"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const CreateConsumer = () => {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [mobileError, setMobileError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [consumerDetails, setConsumerDetails] = useState({
        firstName: '',
        mobileNumber: '',
        email: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.success) {
                    setProducts(data.data);
                } else {
                    setError('Failed to fetch products');
                }
            } catch (err) {
                setError('An error occurred while fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [token]);

    const handleCheckboxChange = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsumerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const consumerData = {
            firstName: consumerDetails.firstName,
            mobileNumber: consumerDetails.mobileNumber,
            email: consumerDetails.email,
            activeStatus: true, // Assuming you want the consumer to be active by default
            selectedProducts: selectedProducts, // Selected product IDs
        };

        try {
            const response = await fetch('http://localhost:3002/api/consumer/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(consumerData),
            });

            const data = await response.json();

            if (data.success) {
                alert('Consumer created successfully!');
                router.push('/dashboard/consumer'); // Redirect to success page (or any other page)
            } else {
                // Set error messages for mobile and email
                if (data.message.includes("Mobile number already exists")) {
                    setMobileError(data.message);
                } else {
                    setMobileError("");
                }
                if (data.message.includes("Email already exists")) {
                    setEmailError(data.message);
                } else {
                    setEmailError("");
                }

                setError(data.message || 'Failed to create consumer');
            }
        } catch (err) {
            setError('An error occurred while creating the consumer');
        }
    };

    const handleCheckboxChangeSelect = () => {
        if (selectedProducts.length === products.length) {
            // If all products are selected, deselect all
            setSelectedProducts([]);
        } else {
            // Otherwise, select all products
            setSelectedProducts(products.map((product) => product.id));
        }
    };
    

    return (
        <div className=" min-h-screen p-6">
            <div className=" shadow-lg rounded-lg max-w-5xl ml-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4 text-left">Consumer Details</h1>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="flex justify-between gap-4">
                            {/* Left Side */}
                            <div className="flex flex-col w-1/2">


                                <div className="mb-4">
                                    <label className="block font-medium mb-2 text-left">Full Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={consumerDetails.firstName}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 text-left"
                                        placeholder="Enter Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium mb-2 text-left">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={consumerDetails.email}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 text-left"
                                        placeholder="Enter Email Address"
                                    />
                                </div>
                                {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
                            </div>

                            {/* Right Side */}
                            <div className="flex-col w-1/2">
                                <div className="mb-4">
                                    <label className="block font-medium mb-2 text-left">Mobile Number</label>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        value={consumerDetails.mobileNumber}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 text-left"
                                        placeholder="Enter Mobile Number"
                                    />
                                </div>
                                {mobileError && <span className="text-red-500 text-sm">{mobileError}</span>}

                            </div>
                        </div>
                    </div>
                    
                </div>
                <div style={{width:"136%"}}>
                <h2 className="text-lg font-bold mb-4 text-left">Select Products to Give Access:</h2>

                <div className="overflow-x-auto">
                        <table className=" border rounded-lg text-left">
                            <thead >
                                <tr >
                                    <th className="border border-gray-300 p-2">
                                        <div className="flex gap-4">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChangeSelect()}
                                            />

                                            Product Image

                                        </div>
                                    </th>
                                    <th className="border border-gray-300 p-2">Product Name</th>
                                    <th className="border border-gray-300 p-2">Category</th>
                                    <th className="border border-gray-300 p-2">Brand</th>
                                    <th className="border border-gray-300 p-2">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b">
                                        <td className=" p-2 flex gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleCheckboxChange(product.id)}
                                            />
                                            <img src={`http://localhost:3002/uploads/${product.thumbnail}`} alt={product.thumbnail} className="w-10 h-10" />
                                        </td>
                                        <td className="border border-gray-300 p-2">{product.productName}</td>
                                        <td className="border border-gray-300 p-2">{product.category}</td>
                                        <td className="border border-gray-300 p-2">{product.modelName}</td>
                                        <td className="border border-gray-300 p-2">{product.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="p-6 sticky bottom-0 flex justify-center">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-1/2"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateConsumer;
