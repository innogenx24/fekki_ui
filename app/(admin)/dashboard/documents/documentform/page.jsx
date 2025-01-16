"use client"; // Mark the component as a Client Component

import React, { useState } from "react";

const AddDocumentForm = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleStatus = () => {
        setIsActive((prevStatus) => !prevStatus);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">Add Document</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side */}
                    <div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium mb-2">Choose File</label>
                            <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg">
                                <input type="file" id="file" className="hidden" />
                                <label
                                    htmlFor="file"
                                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex justify-center items-center"
                                >
                                    Choose File
                                </label>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium mb-2">Document ID *</label>
                            <input
                                type="text"
                                placeholder="Enter Document ID"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium mb-2">Document Title *</label>
                            <input
                                type="text"
                                placeholder="Enter Document Title"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-600 font-medium mb-2">Description *</label>
                            <textarea
                                placeholder="Enter Description"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="mb-6">
                        <label className="block text-gray-600 font-medium mb-2">Control:</label>
                        <div className="flex flex-col items-start space-y-4">
                            <span className="text-gray-700">Active Status</span>
                            <button onClick={toggleStatus} className="focus:outline-none flex items-center">
                                <img
                                    src={isActive ? "/images/turnon.png" : "/images/turnoff.png"}
                                    alt={isActive ? "Turn On" : "Turn Off"}
                                    width={40}
                                    height={40}
                                />
                                <span
                                    className={`ml-4 text-sm font-medium ${isActive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                </span>
                            </button>
                        </div>
                    </div>

                </div>

                <div className="mt-8 text-center">
                    <button className="w-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600">
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddDocumentForm;
