import React from "react";

const AddDocumentForm = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Add Document</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">File Details</label>
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
          {/* Active Status Toggle */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Control:</label>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Active Status</span>
              <input
                type="checkbox"
                className="toggle-checkbox hidden"
                id="statusToggle"
              />
              <label
                htmlFor="statusToggle"
                className="toggle-label w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
              >
                <div className="toggle-circle w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out"></div>
              </label>
            </div>
          </div>
        </div>
        {/* Input Fields */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Document ID *
            </label>
            <input
              type="text"
              placeholder="Enter Document ID"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Document Title *
            </label>
            <input
              type="text"
              placeholder="Enter Document Title"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-gray-600 font-medium mb-2">
            Description *
          </label>
          <textarea
            placeholder="Enter Description"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        {/* Save Button */}
        <div className="mt-8 text-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentForm;
