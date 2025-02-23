import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import { fetchSuppliersService, deleteSupplierService } from '../services/operations/supplier';
import ExportCSVButton from '../components/common/ExportCSVButton'; // ✅ Import Export CSV Button

export const ManageSupplier = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suppliers } = useSelector((state) => state.supplier);
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const { loading: supplierLoading } = useSelector((state) => state.supplier);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState(null);

  // Fetch suppliers on component mount
  useEffect(() => {
    if (suppliers.length === 0) {
      dispatch(fetchSuppliersService(token));
    }
  }, [suppliers, dispatch, token]);

  const handleDeleteSupplier = (supplierId) => {
    setSupplierIdToDelete(supplierId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (supplierIdToDelete) {
      dispatch(deleteSupplierService(token, supplierIdToDelete));
      setSupplierIdToDelete(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSupplierIdToDelete(null);
  };

  // ✅ Handle Update Button Click
  const handleUpdateSupplier = (supplier) => {
    navigate('/supplier/new-supplier', { state: { supplier } }); // Pass supplier data for update
  };

  // ✅ Format Supplier Data for CSV Export
  const formattedSuppliers = suppliers.map((supplier, index) => ({
    'S/N': index + 1,
    'Name': supplier.billingAddress.name,
    'Company': supplier.billingAddress.company,
    'Email': supplier.billingAddress.email,
    'Vendor Name': supplier?.additionalDetails?.plantName || 'N/A',
  }));

  const csvHeaders = ['S/N', 'Name', 'Company', 'Email', 'Vendor Name'];

  return (
    <div className="container mx-auto mt-10">
      <div className="w-full bg-white shadow-xl p-4 mb-4 rounded-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-blue-600">Supplier List</h1>

        {/* ✅ Export to CSV Button */}
        <ExportCSVButton data={formattedSuppliers} filename="suppliers.csv" headers={csvHeaders} />
      </div>

      {/* Loading State */}
      {(authLoading || supplierLoading) ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
          {suppliers && suppliers.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-inner">
              <thead className='bg-blue-600 text-white'>
                <tr>
                  <th className="py-3 px-4 border-b">S. No</th>
                  <th className="py-3 px-4 border-b">Name</th>
                  <th className="py-3 px-4 border-b">Company</th>
                  <th className="py-3 px-4 border-b">Email</th>
                  <th className="py-3 px-4 border-b">Vendor Name</th>
                  <th className="py-3 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, index) => (
                  <tr key={supplier._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">{supplier.billingAddress.name}</td>
                    <td className="py-3 px-4 border-b">{supplier.billingAddress.company}</td>
                    <td className="py-3 px-4 border-b">{supplier.billingAddress.email}</td>
                    <td className="py-3 px-4 border-b">{supplier?.additionalDetails?.plantName || 'N/A'}</td>
                    <td className="py-3 px-4 border-b text-center space-x-2">
                      {/* ✅ Update Button */}
                      <button
                        onClick={() => handleUpdateSupplier(supplier)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Update
                      </button>

                      {/* 🗑️ Delete Button */}
                      <button
                        onClick={() => handleDeleteSupplier(supplier._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No suppliers found.</p>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this supplier?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
