import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWarehousesService } from '../services/operations/warehouse';
import { deleteProduct } from '../services/operations/warehouse';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import ExportCSVButton from '../components/common/ExportCSVButton'; // ✅ Import Export CSV Button

export const ManageNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { warehouses } = useSelector((state) => state.warehouse);

  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    if (warehouses.length === 0) {
      dispatch(fetchWarehousesService(token));
    }
  }, [warehouses, dispatch, token]);

  const handleWarehouseChange = (e) => {
    const warehouseId = e.target.value;
    setSelectedWarehouse(warehouseId);
    const selectedWarehouseData = warehouses.find(warehouse => warehouse._id === warehouseId);
    setProducts(selectedWarehouseData ? selectedWarehouseData.warehouseProducts : []);
  };

  const openConfirmationModal = (productId) => {
    setProductIdToDelete(productId);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (productIdToDelete) {
      try {
        await dispatch(deleteProduct(productIdToDelete, token, selectedWarehouse));
        setProducts((prevProducts) =>
          prevProducts.filter(product => product._id !== productIdToDelete)
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to delete product:', error);
        setIsModalOpen(false);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Format Products Data for CSV Export
  const formattedProducts = filteredProducts.map((product, index) => ({
    'S/N': index + 1,
    'Product Name': product.name,
    'Retail Price': product.retailPrice,
    'Stock Unit': product.stockUnit,
  }));

  const csvHeaders = ['S/N', 'Product Name', 'Retail Price', 'Stock Unit'];

  return (
    <div className="container mx-auto p-6">
      <div className="w-full bg-white shadow-xl p-4 mb-4 rounded-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">Manage Products</h1>

        {/* ✅ Export to CSV Button */}
        <ExportCSVButton data={formattedProducts} filename="products.csv" headers={csvHeaders} />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow-md flex flex-col md:flex-row gap-3">
          <select
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          >
            <option value="" disabled>Select a warehouse</option>
            {warehouses.map(warehouse => (
              <option key={warehouse._id} value={warehouse._id}>
                {warehouse.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Products List</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                <th className="border border-gray-300 px-4 py-2">Retail Price</th>
                <th className="border border-gray-300 px-4 py-2">Stock Unit</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.retailPrice}</td>
                    <td className="border border-gray-300 px-4 py-2">{product.stockUnit}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                        onClick={() => navigate(`/stock/update-product/${product._id}`, { state: { product, warehouseId: selectedWarehouse } })}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => openConfirmationModal(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this product?"
          onConfirm={handleDeleteProduct}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
