import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWarehouseService, fetchWarehousesService } from '../services/operations/warehouse';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import { WarehouseForm } from '../components/WarehouseForm';
import ExportCSVButton from '../components/common/ExportCSVButton'; // ✅ Use existing Export button

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
  }, [dispatch, token]);

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (warehouseId) => {
    setWarehouseToDelete(warehouseId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteWarehouseService(token, warehouseToDelete));
    setIsModalOpen(false);
  };

  // ✅ Format data for CSV Export
  const formattedWarehouses = warehouses.map((warehouse, index) => ({
    'S/N': index + 1,
    'Warehouse Name': warehouse.name,
    'Total Products': warehouse?.warehouseProducts?.length || 0,
    'Created At': new Date(warehouse.createdAt).toLocaleDateString(),
  }));

  const csvHeaders = ['S/N', 'Warehouse Name', 'Total Products', 'Created At'];

  return (
    <div className="container mx-auto">
      {/* Card for Manage Warehouse Title */}
      <div className="w-full bg-white shadow-xl p-6 mb-6 rounded-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Warehouse Management</h1>
          <p className="text-pure-greys-500">Manage Your Warehouse here</p>
        </div>

        {/* ✅ Export to CSV Button */}
        <ExportCSVButton data={formattedWarehouses} filename="warehouses.csv" headers={csvHeaders} />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Card for Warehouse Table */}
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-lg shadow-md">
              <div className="flex-1 text-center font-bold">#</div>
              <div className="flex-1 text-center font-bold">Warehouse Name</div>
              <div className="flex-1 text-center font-bold">Total Products</div>
              <div className="flex-1 text-center font-bold">Actions</div>
            </div>

            <div className="space-y-4 mt-4">
              {warehouses && warehouses.length > 0 ? (
                warehouses.map((warehouse, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-richblack-25 p-4 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg bg-white"
                  >
                    <div className="flex-1 text-center font-bold">{index + 1}</div>
                    <div className="flex-1 text-center">{warehouse.name}</div>
                    <div className="flex-1 text-center">{warehouse?.warehouseProducts?.length || 0}</div>
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
                <div className="text-center py-4">No warehouses available.</div>
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
