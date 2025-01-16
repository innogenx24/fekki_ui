'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook

export default function DocumentList() {
  const router = useRouter(); // Initialize the router
  const [documents, setDocuments] = useState([
    {
      id: "0001",
      title: "New T&C",
      fileSize: "700kb",
      description: "-",
      status: false,
    },
    {
      id: "0002",
      title: "Project Proposal",
      fileSize: "1.2MB",
      description: "Proposal document",
      status: true,
    },
    {
      id: "0003",
      title: "Marketing Plan",
      fileSize: "2MB",
      description: "Marketing strategies",
      status: true,
    },
    {
      id: "0004",
      title: "Financial Report",
      fileSize: "500kb",
      description: "Q3 Report",
      status: false,
    },
    {
      id: "0005",
      title: "HR Policies",
      fileSize: "300kb",
      description: "Updated policies",
      status: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const toggleStatus = (id) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === id ? { ...doc, status: !doc.status } : doc
      )
    );
  };

  const handleDeleteClick = (id) => {
    const doc = documents.find((document) => document.id === id);
    setDocumentToDelete(doc);
    setShowModal(true);
  };

  const handleDeleteConfirm = () => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.id !== documentToDelete.id)
    );
    setShowModal(false);
    setDocumentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
    setDocumentToDelete(null);
  };

  const handleEditClick = (id) => {
    router.push(`/dashboard/documents/editdocumentform`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document List</h1>
        {/* Add Document Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => router.push('/dashboard/documents/documentform')}
        >
          Add Document
        </button>
      </div>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">
              <input type="checkbox" />
            </th>
            <th className="border p-3 text-left">Document ID</th>
            <th className="border p-3 text-left">Title</th>
            <th className="border p-3 text-left">File Size</th>
            <th className="border p-3 text-left">Description</th>
            <th className="border p-3 text-center">Status</th>
            <th className="border p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="text-center">
              <td className="border p-3">
                <input type="checkbox" />
              </td>
              <td className="border p-3">{doc.id}</td>
              <td className="border p-3">{doc.title}</td>
              <td className="border p-3">{doc.fileSize}</td>
              <td className="border p-3">{doc.description}</td>
              <td className="border p-3">
                <div className="flex justify-center items-center h-full">
                  <button onClick={() => toggleStatus(doc.id)}>
                    {doc.status ? (
                      <Image src="/images/turnon.png" alt="Turn On" width={40} height={40} />
                    ) : (
                      <Image src="/images/turnoff.png" alt="Turn Off" width={40} height={40} />
                    )}
                  </button>
                </div>
              </td>
              <td className="border p-3">
                <div className="flex justify-center">
                  <button
                    className="text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteClick(doc.id)}
                  >
                    <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                  </button>
                  <button
                    className="text-white px-2 py-1 rounded"
                    onClick={() => handleEditClick(doc.id)}
                  >
                    <Image src="/images/edit.png" alt="Edit" width={40} height={40} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the document "{documentToDelete?.title}"?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
