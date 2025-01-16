"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const EditConsumer = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const consumerId = searchParams.get("id");
    const token = localStorage.getItem("token");
    const [mobileError, setMobileError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [consumerDetails, setConsumerDetails] = useState({
        firstName: "",
        mobileNumber: "",
        email: "",
    });

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Consumer Details and Products
    useEffect(() => {
        const fetchConsumerDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3002/api/consumer/${consumerId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await response.json();

                if (data.success) {
                    setConsumerDetails({
                        firstName: data.data.first_name,
                        mobileNumber: data.data.mobile_number,
                        email: data.data.email,
                    });
                    setSelectedProducts(
                        data.data.consumerProducts.map((p) => p.product_id)
                    );
                } else {
                    setError("Failed to fetch consumer details");
                }
            } catch (err) {
                setError("An error occurred while fetching consumer details");
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3002/api/products", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                if (data.success) {
                    setProducts(data.data);
                } else {
                    setError("Failed to fetch products");
                }
            } catch (err) {
                setError("An error occurred while fetching products");
            }
        };

        fetchConsumerDetails();
        fetchProducts();
        setLoading(false);
    }, [consumerId, token]);

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
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const consumerData = {
            firstName: consumerDetails.firstName,
            mobileNumber: consumerDetails.mobileNumber,
            email: consumerDetails.email,
            selectedProducts,
        };

        try {
            const response = await fetch(
                `http://localhost:3002/api/consumer/${consumerId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(consumerData),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Consumer updated successfully!");
                router.push("/dashboard/consumer");
            } else {
                // Field-specific error handling
                if (data.message === "Mobile number already exists.") {
                    setMobileError("The mobile number is already registered. Please use a different one.");
                } else {
                    setMobileError("");  // Clear mobile error
                }

                if (data.message === "Email already exists.") {
                    setEmailError("The email is already registered. Please use a different one.");
                } else {
                    setEmailError("");  // Clear email error
                }

                setError(data.message || "Failed to update consumer");
            }
        } catch (err) {
            setError("An error occurred while updating the consumer");
        }
    };


    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;

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
            <div className=" rounded-lg max-w-5xl ml-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4 text-left">Edit Consumer</h1>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <div className="flex justify-between gap-4">
                            <div className="flex flex-col w-1/2">


                                <div className="mb-4">
                                    <label className="block font-medium mb-2 text-left">
                                        Full Name
                                    </label>
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
                                    <label className="block font-medium mb-2 text-left">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={consumerDetails.email}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 text-left"
                                        placeholder="Enter Email Address"
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                                )}
                            </div>

                            <div className="flex-col w-1/2">
                                <div className="mb-4">
                                    <label className="block font-medium mb-2 text-left">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        value={consumerDetails.mobileNumber}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2 text-left"
                                        placeholder="Enter Mobile Number"
                                    />
                                </div>
                                {mobileError && (
                                    <p className="text-red-500 text-sm mt-1">{mobileError}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "140%" }}>
                        <h2 className="text-lg font-bold mb-4 text-left">
                            Select Products to Give Access:
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border rounded-lg text-left">
                                <thead className="bg-gray-300">
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 p-2">
                                            <div className="flex gap-4">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChangeSelect()}
                                                    checked={selectedProducts.length === products.length}
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
                                            <td className="border border-gray-300 p-2">
                                                <div className="flex gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => handleCheckboxChange(product.id)}
                                                    />
                                                    <img
                                                        src={`http://localhost:3002/uploads/${product.thumbnail}`}
                                                        alt={product.thumbnail}
                                                        className="w-10 h-10"
                                                    />
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {product.productName}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {product.category}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {product.modelName}
                                            </td>
                                            <td className="border border-gray-300 p-2">
                                                {product.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <div className="p-6 sticky bottom-0 bg-white flex justify-center shadow-md">
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

export default EditConsumer;
