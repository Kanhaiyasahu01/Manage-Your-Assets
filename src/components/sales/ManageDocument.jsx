import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMarketingQuotations } from '../../services/operations/marketing';
import {
  fetchAllOrdersService,
  deleteOrderByIdService,
  fetchAllQuotationsService,
  deleteQuotationByIdService,
} from '../../services/operations/client';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../common/ConfirmationModel';
import ExportCSVButton from '../common/ExportCSVButton';
export const ManageDocument = ({ type }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  console.log("INV",filteredDocuments);
  useEffect(() => {
    if (type === 'invoice') {
      dispatch(fetchAllOrdersService(token, setDocuments));
    } else if (type === 'marketing') {
      dispatch(fetchMarketingQuotations(token, setDocuments));
    } else {
      dispatch(fetchAllQuotationsService(token, setDocuments));
    }
  }, [dispatch, token, type]);

  useEffect(() => {
    let filtered = documents;

    if (clientName.trim() !== '') {
      filtered = filtered.filter((document) =>
        document.client?.billingAddress?.company
          ?.toLowerCase()
          .includes(clientName.toLowerCase())
      );
    }

    if (documentNumber.trim() !== '') {
      const cleanedDocumentNumber = documentNumber
        .replace('INV-', '')
        .replace('QUO-', '')
        .trim();
      filtered = filtered.filter((document) => {
        const documentNum =
          document.documentDetails?.documentNumber?.replace(
            type === 'invoice' ? 'INV-' : 'QUO-',
            ''
          ) || '';

        return documentNum.includes(cleanedDocumentNumber);
      });
    }

    const fromDateObj = fromDate ? new Date(fromDate) : null;
    const toDateObj = toDate ? new Date(toDate) : null;

    if (toDateObj) {
      toDateObj.setHours(23, 59, 59, 999);
    }

    filtered = filtered.filter((document) => {
      const documentDate = new Date(document.createdAt);
      const isAfterFromDate = fromDateObj ? documentDate >= fromDateObj : true;
      const isBeforeToDate = toDateObj ? documentDate <= toDateObj : true;
      return isAfterFromDate && isBeforeToDate;
    });

    setFilteredDocuments(filtered);
  }, [clientName, documentNumber, fromDate, toDate, documents, type]);

  const handleViewDocument = (documentId) => {
    navigate(
      `/${type === 'invoice' ? 'sales/viewOrder' : 'sales/view'}/${documentId}`
    );
  };

  const openDeleteModal = (documentId, clientId) => {
    setDocumentToDelete({ documentId, clientId });
    setIsModalOpen(true);
  };

  const handleDeleteDocument = async () => {
    if (documentToDelete) {
      const { documentId, clientId } = documentToDelete;
      try {
        const formData = {
          orderId: documentId,
          clientId,
        };
        console.log('formData', formData);
        await dispatch(deleteOrderByIdService(token, formData));

        setFilteredDocuments((prev) =>
          prev.filter((document) => document._id !== documentId)
        );
        setDocuments((prev) =>
          prev.filter((document) => document._id !== documentId)
        );

        console.log(`Deleted ${type} ${documentId}`);
      } catch (error) {
        console.error(`Failed to delete ${type} ${documentId}:`, error);
      }
      setIsModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  // ✅ Format data for CSV export
  const formattedData = filteredDocuments.map((document, index) => ({
    'S/N': index + 1,
    'Client Name': document.client?.billingAddress?.company || 'N/A',
    'Date': new Date(document.createdAt).toLocaleDateString('en-US'),
    'Document Number':
      document.invoiceDetails?.invoiceNumber || (type === 'invoice' ? 'INV-N/A' : 'QUO-N/A'),
    'Total Amount': document.grandTotal || 0,
  }));

  return (
    <div className="manage-document-container p-6">
      <div className="w-full bg-white shadow-xl p-4 mb-4 rounded-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Manage {type === 'invoice' ? 'Invoices' : 'Quotations'}
        </h1>

        {/* ✅ Export to CSV Button */}
        <ExportCSVButton
          data={formattedData}
          filename={`${type}-documents.csv`}
          headers={['S/N', 'Client Name', 'Date', 'Document Number', 'Total Amount']}
        />
      </div>

      {/* Search Form Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
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
            <label className="block mb-2 font-semibold">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Search by Client Name"
              className="border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              {type === 'invoice' ? 'Invoice Number' : 'Quotation Number'}
            </label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder={`Format: ${type === 'invoice' ? 'INV-' : 'QUO-'}XXXXX`}
              className="border px-2 py-1 rounded"
            />
          </div>
        </div>
      </div>

      {/* Documents Table Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {type === 'invoice' ? 'Invoices' : 'Quotations'} List
        </h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-black px-4 py-2">S/N</th>
              <th className="border border-black px-4 py-2">Client Name</th>
              <th className="border border-black px-4 py-2">Date</th>
              <th className="border border-black px-4 py-2">Total Amount</th>
              <th className="border border-black px-4 py-2">Settings</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document, index) => (
                <tr key={document._id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {document.client?.billingAddress?.company || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(document.createdAt).toLocaleDateString('en-US')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{document.grandTotal}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                      onClick={() => handleViewDocument(document._id)}
                    >
                      View
                    </button>
                    {/* Delete Button can be re-enabled if needed */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center border px-4 py-2">
                  No {type === 'invoice' ? 'invoices' : 'quotations'} found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
