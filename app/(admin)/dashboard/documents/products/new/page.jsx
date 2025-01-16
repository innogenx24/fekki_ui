// @/app/(admin)/inventory/products/new/page.jsx

"use client";

import InventoryForm from "@/components/inventoryForms/InventoryForm";



export default function NewInventoryPage() {
  return (
    <div className="bg-white p-6 rounded-md max-w-2xl mx-auto mt-8">
      <InventoryForm type="create" />
    </div>
  );
}
