import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWarehouseService, fetchWarehousesService } from '../services/operations/warehouse';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import { WarehouseForm } from '../components/WarehouseForm';

export const ManageWarehouse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { warehouses, loading } = useSelector((state) => state.warehouse);
  const { token } = useSelector((state) => state.auth);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);

  useEffect(() => {
    if (warehouses.length === 0) {
      dispatch(fetchWarehousesService(token));
    }
    console.log("warehouse", warehouses);
  }, [dispatch, token]);

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (warehouseId) => {
    setWarehouseToDelete(warehouseId);
    console.log(warehouseToDelete);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteWarehouseService(token, warehouseToDelete));
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto">
      {/* Card for Manage Warehouse Title */}
      <div className="w-full bg-white shadow-xl p-6 mb-6 rounded-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600">Warehouse Management</h1>
        <p className="text-pure-greys-500 text-center">Manage Your Warehouse here</p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Card for Warehouse Table */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            {/* Heading Row */}
            <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-lg shadow-md">
              <div className="flex-1 text-center font-bold">#</div>
              <div className="flex-1 text-center font-bold">Warehouse Name</div>
              <div className="flex-1 text-center font-bold">Total Products</div>
              <div className="flex-1 text-center font-bold">Actions</div>
            </div>

            {/* List of Warehouses */}
            <div className="space-y-4 mt-4">
              {warehouses && warehouses.length > 0 ? (
                warehouses.map((warehouse, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-richblack-25 p-4 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg bg-white"
                  >
                    <div className="flex-1 text-center">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span>{warehouse.name}</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span>{warehouse?.warehouseProducts?.length || 0}</span>
                    </div>
                    <div className="flex-1 gap-2 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg transition duration-200"
                        onClick={() => handleEdit(warehouse)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 ml-2 px-3 rounded-lg transition duration-200"
                        onClick={() => handleDeleteClick(warehouse._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  No warehouses available.
                </div>
              )}
            </div>
          </div>

          {/* Form for Adding or Editing Warehouse */}
          {isFormOpen && (
            <WarehouseForm
              warehouse={selectedWarehouse}
              onSave={() => setIsFormOpen(false)}
              onCancel={() => setIsFormOpen(false)}
            />
          )}

          {/* Confirmation Modal */}
          <ConfirmationModal
            isOpen={isModalOpen}
            title="Confirm Deletion"
            message="Are you sure you want to delete this warehouse?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};
