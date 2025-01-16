// @/app/(admin)/inventory/inventory/page.jsx

"use server";

import { getInventories } from "@/actions/inventory/inventoryActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewInventoryButton } from "@/components/inventoryColumns/inventoryColumns";

export default async function InventoryPage() {
  const inventories = await getInventories();

  return (
    <div className="bg-white p-6 rounded-md mt-4">
      <CreateNewInventoryButton />
      <DataTable columns={columns} data={inventories} />
    </div>
  );
}
