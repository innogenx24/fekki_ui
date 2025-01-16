"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');
  const [productType, setproductType] = useState('');
  const [category, setCategory] = useState('');
  const userRoleName = user.role_name;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const openDeleteModal = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productToDelete.id)
        );
        setShowModal(false);
      } else {
        console.error('Failed to delete product:', result.message);
      }
    } catch (error) {
      console.error('An error occurred while deleting product:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3002/api/products/active/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, isActive: !currentStatus } : product
          )
        );
      } else {
        console.error('Failed to update status:', result.message);
      }
    } catch (error) {
      console.error('An error occurred while toggling status:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBrandChange = (e) => {
    setproductType(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    const matchesProductType = productType ? product.productType === productType : true;

    return matchesSearchQuery && matchesCategory && matchesProductType;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-gray-500 justify-left mb-4">
        Products Library
      </div>

      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center ml-[40%]">
          <div>
            <select
              value={productType}
              onChange={handleBrandChange}
              className="p-2 border rounded-md mr-4 mb-1"
            >
              <option value="">All Brands</option>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
            </select>
          </div>

          <div>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="p-2 border rounded-md mb-1"
            >
              <option value="">All Categories</option>
              <option value="kitchen Items">Kitchen Items</option>
              <option value="Home Items">Home Items</option>
              <option value="Tech">Tech</option>
            </select>
          </div>
        </div>

        <div className="flex-1 flex justify-center mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Product Name"
            className="p-2 border rounded-[14px] w-1/2 ml-[10%]"
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push('/dashboard/product-library/create-product')}
          >
            Add Product
          </button>
        </div>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">No</th>
            <th className="border border-gray-300 p-2">Product Image</th>
            <th className="border border-gray-300 p-2">Product Name</th>
            <th className="border border-gray-300 p-2">Model</th>
            <th className="border border-gray-300 p-2" style={{ width: '10%' }}>Category</th>
            <th className="border border-gray-300 p-2" style={{ width: '30%' }}>Description</th>
            <th className="border border-gray-300 p-2">Active Status</th>
            {userRoleName === 'Admin' && (
              <th className="border border-gray-300 p-2">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product.id} className="text-center">
              <td className="border border-gray-300 p-2">{index + 1}</td>
              <td className="border border-gray-300 p-2">
                <img
                  src={`http://localhost:3002/uploads/${product.thumbnail}`}
                  alt={product.productName}
                  className="w-16 h-16 mx-auto"
                />
              </td>
              <td className="border border-gray-300 p-2">{product.productName}</td>
              <td className="border border-gray-300 p-2">{product.modelName}</td>
              <td className="border border-gray-300 p-2">{product.category}</td>
              <td className="border border-gray-300 p-2">{product.description}</td>
              <td className="border border-gray-300 p-2">
                <div className="flex justify-center items-center h-full">
                  <button onClick={() => toggleStatus(product.id, product.isActive)}>
                    {product.isActive ? (
                      <Image src="/images/turnon.png" alt="Turn On" width={40} height={40} />
                    ) : (
                      <Image src="/images/turnoff.png" alt="Turn Off" width={40} height={40} />
                    )}
                  </button>
                </div>
              </td>
              {userRoleName === 'Admin' && (
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center">
                    <button
                      className="text-white px-2 py-1 rounded"
                      onClick={() => openDeleteModal(product.id, product.productName)}
                    >
                      <Image src="/images/delete.png" alt="Delete" width={40} height={40} />
                    </button>

                    <button
                      className="text-white px-2 py-1"
                      onClick={() => router.push(`/dashboard/product-library/edit-product?id=${product.id}`)}
                    >
                      <Image src="/images/edit.png" alt="Edit" width={40} height={40} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the product "{productToDelete?.name}"?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
};

export default ProductList;
