// @/app/(admin)/procurement/purchase-requests/new/page.jsx

"use client";

import PurchaseRequestForm from "@/components/procurementForms/PurchaseRequestForm";

export default function NewPurchaseRequestPage() {
  return (
    <div className="bg-white p-6 rounded-md mx-auto mt-8 lg:max-w-full">
      <PurchaseRequestForm type="create" />
    </div>
  );
}
