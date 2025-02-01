import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import { fetchSuppliersService,deleteSupplierService } from '../services/operations/supplier';
export const ManageSupplier = () => {
  const dispatch = useDispatch();
  const { suppliers } = useSelector((state) => state.supplier); // Assuming you have a supplier slice
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const { loading: supplierLoading } = useSelector((state) => state.supplier);
  
  // State for the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierIdToDelete, setSupplierIdToDelete] = useState(null);

  // Fetch suppliers when the component is mounted
  useEffect(() => {
    if (suppliers.length === 0) {
      dispatch(fetchSuppliersService(token)); // Fetch suppliers if the list is empty
    }
  }, [suppliers, dispatch, token]);

  const handleDeleteSupplier = (supplierId) => {
    setSupplierIdToDelete(supplierId); // Set the supplier ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = () => {
    if (supplierIdToDelete) {
      dispatch(deleteSupplierService(token, supplierIdToDelete)); // Pass the ID directly
      setSupplierIdToDelete(null); // Clear the supplier ID
      setIsModalOpen(false); // Close the modal
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); // Close the modal
    setSupplierIdToDelete(null); // Clear the supplier ID
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="w-full bg-white shadow-xl p-4 mb-4 rounded-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600">Supplier List</h1>
      </div>
      
      {/* Loading state */}
      {(authLoading || supplierLoading) ? (
        <div className="text-center">Loading...</div>
      ) : (
        // Card container for the table
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
          {suppliers && suppliers.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-inner">
              <thead className='bg-blue-600 text-white'>
                <tr className="bg-gray-100 text-gray-700 text-left">
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
                    <td className="py-3 px-4 border-b">{supplier.additionalDetails.plantName}</td>
                    <td className="py-3 px-4 border-b text-center">
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
