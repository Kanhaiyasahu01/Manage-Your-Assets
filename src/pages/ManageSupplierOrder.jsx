import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSupplierOrdersService, deleteSupplierOrderByIdService } from '../services/operations/supplier';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import ExportCSVButton from '../components/common/ExportCSVButton'; // ✅ Import Export CSV Button

export const ManageSupplierOrder = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllSupplierOrdersService(token, setOrders));
  }, [dispatch, token]);

  useEffect(() => {
    let filtered = [...orders];

    if (supplierName.trim() !== '') {
      filtered = filtered.filter((order) =>
        order.supplier?.billingAddress?.company?.toLowerCase().includes(supplierName.toLowerCase())
      );
    }

    if (orderNumber.trim() !== '') {
      filtered = filtered.filter((order) =>
        order.orderNumber?.toLowerCase().includes(orderNumber.toLowerCase())
      );
    }

    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;

    if (toDateObj) {
      toDateObj.setHours(23, 59, 59, 999);
    }

    filtered = filtered.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const isAfterFromDate = fromDateObj ? orderDate >= fromDateObj : true;
      const isBeforeToDate = toDateObj ? orderDate <= toDateObj : true;

      return isAfterFromDate && isBeforeToDate;
    });

    setFilteredOrders(filtered);
  }, [supplierName, orderNumber, fromDate, toDate, orders]);

  const handleViewOrder = (orderId) => {
    navigate(`/supplier/viewOrder/${orderId}`);
  };

  const openDeleteModal = (orderId, supplierId) => {
    setOrderToDelete({ orderId, supplierId });
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      const { orderId, supplierId } = orderToDelete;

      try {
        const formData = { orderId, supplierId };
        await dispatch(deleteSupplierOrderByIdService(token, formData));

        setFilteredOrders((prev) => prev.filter((order) => order._id !== orderToDelete.orderId));
        setOrders((prev) => prev.filter((order) => order._id !== orderToDelete.orderId));
      } catch (error) {
        console.error(`Failed to delete order ${orderToDelete.orderId}:`, error);
      }
      setIsModalOpen(false);
      setOrderToDelete(null);
    }
  };


  // ✅ Format Data for CSV Export
  const formattedOrders = filteredOrders.map((order, index) => ({
    'S/N': index + 1,
    'Supplier Name': order.supplier?.billingAddress?.company || 'N/A',
    'Date': new Date(order.createdAt).toLocaleDateString('en-US'),
    'Total Amount': order.grandTotal,
  }));

  const csvHeaders = ['S/N', 'Supplier Name', 'Date', 'Total Amount'];

  return (
    <div className="manage-supplier-order-container p-6">
      {/* Header */}
      <div className="w-full bg-white shadow-xl p-4 mb-4 rounded-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">Manage Supplier Orders</h1>

        {/* ✅ Export to CSV Button */}
        <ExportCSVButton data={formattedOrders} filename="supplier_orders.csv" headers={csvHeaders} />
      </div>

      {/* Search Form Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Search Supplier Orders</h2>
        <div className="flex gap-4 mb-6 flex-wrap">
          <div>
            <label className="block mb-2 font-semibold">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Supplier Name</label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Search by Supplier Name"
              className="border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter Order Number"
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Supplier Orders List</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-black px-4 py-2">S/N</th>
              <th className="border border-black px-4 py-2">Supplier Name</th>
              <th className="border border-black px-4 py-2">Date</th>
              <th className="border border-black px-4 py-2">Total Amount</th>
              <th className="border border-black px-4 py-2">Settings</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.supplier?.billingAddress?.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleDateString('en-US')}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.grandTotal}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => openDeleteModal(order._id, order.supplier._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center border px-4 py-2">
                  No supplier orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        onConfirm={handleDeleteOrder}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};
