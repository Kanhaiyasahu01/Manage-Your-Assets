import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchClientsService, deleteClientService } from '../services/operations/client';
import { ConfirmationModal } from '../components/common/ConfirmationModel';
import ExportCSVButton from '../components/common/ExportCSVButton';

export const ManageClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { token, loading: authLoading } = useSelector((state) => state.auth);
  const { loading: clientLoading } = useSelector((state) => state.client);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  // Fetch clients on mount
  useEffect(() => {
    if (clients.length === 0) {
      dispatch(fetchClientsService(token));
    }
  }, [clients, dispatch, token]);

  const handleDeleteClient = (clientId) => {
    setClientIdToDelete(clientId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientIdToDelete) {
      dispatch(deleteClientService(token, clientIdToDelete));
      setClientIdToDelete(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setClientIdToDelete(null);
  };

  const handleUpdateClient = (client) => {
    navigate('/crm/add-client', { state: { client } });
  };

  const formattedClients = clients.map((client, index) => ({
    'S/N': index + 1,
    'Name': client.billingAddress.name,
    'Company': client.billingAddress.company,
    'Email': client.billingAddress.email,
    'Plant Name': client?.additionalDetails?.plantName || 'N/A',
  }));

  const csvHeaders = ['S/N', 'Name', 'Company', 'Email', 'Plant Name'];

  return (
    <div className="container mx-auto mt-10">
      <div className="w-full bg-white shadow-xl p-6 mb-6 rounded-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center text-blue-600">Manage Client</h1>

        {/* Export to CSV Button */}
        <ExportCSVButton data={formattedClients} filename="clients.csv" headers={csvHeaders} />
      </div>

      {/* Loading State */}
      {(authLoading || clientLoading) ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-x-auto">
          {clients && clients.length > 0 ? (
            <table className="min-w-full table-fixed bg-white border border-gray-200 rounded-md shadow-inner">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 border-b w-12">S. No</th>
                  <th className="py-3 px-4 border-b w-32">Name</th>
                  <th className="py-3 px-4 border-b w-32">Company</th>
                  <th className="py-3 px-4 border-b w-40">Email</th>
                  <th className="py-3 px-4 border-b w-32">Plant Name</th>
                  <th className="py-3 px-4 border-b w-40 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={client._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-center">{index + 1}</td>
                    <td className="py-3 px-4 border-b">{client.billingAddress.name}</td>
                    <td className="py-3 px-4 border-b">{client.billingAddress.company}</td>
                    <td className="py-3 px-4 border-b">{client.billingAddress.email}</td>
                    <td className="py-3 px-4 border-b">{client?.additionalDetails?.plantName || 'N/A'}</td>
                    <td className="py-3 px-4 border-b text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleUpdateClient(client)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No clients found.</p>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this client?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
