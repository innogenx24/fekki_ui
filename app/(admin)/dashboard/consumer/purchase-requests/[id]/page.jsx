// @/app/(admin)/procurement/purchase-requests/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import PurchaseRequestForm from "@/components/procurementForms/PurchaseRequestForm";
import { getPurchaseRequestById } from "@/actions/procurement/purchaseRequestActions";

export default function UpdatePurchaseRequestPage({ params }) {
  const { id } = params;
  const [purchaseRequestData, setPurchaseRequestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPurchaseRequest() {
      const pr = await getPurchaseRequestById(id);
      setPurchaseRequestData(pr);
      setLoading(false);
    }
    fetchPurchaseRequest();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md mx-auto mt-8 lg:max-w-full">
      <PurchaseRequestForm type="edit" data={purchaseRequestData} />
    </div>
  );
}
