// @/app/(admin)/procurement/suppliers/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import SupplierForm from "@/components/procurementForms/SupplierForm";
import { getSupplierById } from "@/actions/procurement/supplierActions";

export default function UpdateSupplierPage({ params }) {
  const { id } = params;
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupplier() {
      const supplier = await getSupplierById(id);
      setSupplierData(supplier);
      setLoading(false);
    }
    fetchSupplier();
  }, [id]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-md mx-auto mt-8 lg:max-w-full">
      <SupplierForm type="edit" data={supplierData} />
    </div>
  );
}
