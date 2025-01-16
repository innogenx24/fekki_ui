

"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Profile() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userID = searchParams.get("id");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const Rolename = user.role_name;

    const [formData, setFormData] = useState({
        clientBrand: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        password: "",
        loginId: "",
        country: "",
        state: "",
        city: "",
        street: "",
        pincode:"",
        landmark: "",
        pincode: "",
        status: "",
        image: null,
    });

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
                } else {
                    console.error("Error fetching data:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        if (userID) fetchClientData();
    }, [userID, token]);

    const handleClickEditProfile = () => {
        router.push(`/dashboard/profile-details/edit-profile?id=${userID}`);
    };

    const handleLogoutProfile = () => {
        router.push(`/sign-in`);
    };

    return (
        <div className="flex justify-center mt-10">

            <div className="w-1/2 bg-white rounded shadow p-6">
                <div className="text-gray-500 justify-right mb-10">
                    Profile-Details

                </div>
                <div className="flex items-center">
                    {formData.image ? (
                        <Image
                            className="w-24 h-24 rounded-full mr-6"
                            src={`http://localhost:3002/uploads/${formData.image}`}
                            alt="Profile"
                            width={96}
                            height={96}
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full mr-6 bg-gray-200" />
                    )}
                    <div>
                        <h2 className="text-xl font-bold">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <p className="text-gray-500">({Rolename})</p>
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <p>📍 {`${formData.street}, ${formData.city}, ${formData.state}, ${formData.pincode}.`}</p>
                    <p>📞 {formData.mobileNumber}</p>
                    <p>✉️ {formData.email}</p>
                    {/* <p>🔒 {formData.password}</p> */}
                </div>

                <div className="mt-6 flex space-x-4">
                    <button className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleLogoutProfile}

                    >Logout</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleClickEditProfile}
                    >Edit</button>
                </div>
            </div>
        </div>
    );
}
