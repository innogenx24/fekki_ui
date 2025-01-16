// @/app/(admin)/procurement/suppliers/new/page.jsx

"use client";

import SupplierForm from "@/components/procurementForms/SupplierForm";

export default function NewSupplierPage() {
  return (
    <div className="bg-white p-6 rounded-md mx-auto mt-8 lg:max-w-full">
      <SupplierForm type="create" />
    </div>
  );
}
