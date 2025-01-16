// @/app/(admin)/procurement/suppliers/page.jsx

"use server";

import { getSuppliers } from "@/actions/procurement/supplierActions";
import { DataTable } from "@/components/DataTable";
import { columns, CreateNewSupplierButton } from "@/components/procurementColumns/supplierColumns";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="bg-white p-6 rounded-md mt-0 flex-1">
      <CreateNewSupplierButton />
      <DataTable columns={columns} data={suppliers} />
    </div>
  );
}
