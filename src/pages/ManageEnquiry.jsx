import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEnquiriesService } from '../services/operations/enquiry';
import ExportCSVButton from '../components/common/ExportCSVButton';
export const ManageEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllEnquiriesService(token, setEnquiries));
  }, [dispatch, token]);

  useEffect(() => {
    const results = enquiries.filter((enquiry) => {
      const matchesName = enquiry.plantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = searchDate
        ? new Date(enquiry.createdAt).toISOString().slice(0, 10) === searchDate
        : true;
      return matchesName && matchesDate;
    });
    setFilteredEnquiries(results);
  }, [searchTerm, searchDate, enquiries]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
  };

  const handleViewClick = (id) => {
    navigate(`/sales/enquiries/view/${id}`);
  };

  const handleUpdateClick = (id) => {
    navigate(`/sales/enquiries/update/${id}`);
  };


  const formattedData = filteredEnquiries.map((enquiry) => ({
    'Plant Name': enquiry.plantName || '',
    'Contact Person': enquiry.contactPerson || '',
    'Created At': new Date(enquiry.createdAt).toLocaleDateString() || '',
    'Materials': enquiry.materialRequired
      ? enquiry.materialRequired.map((mat) => `${mat.name.trim()} (${mat.quantity})`).join(', ')
      : '',
    'Note': enquiry.note || ''
  }));


  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Manage Enquiries</h2>

          {/* ✅ Reusable ExportCSVButton */}
          <ExportCSVButton
            data={formattedData}
            filename="enquiries.csv"
            headers={['Plant Name', 'Contact Person', 'Created At', 'Materials', 'Note']}
          />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by Plant Name"
          className="p-2 border rounded w-full mb-4"
        />

        <input
          type="date"
          value={searchDate}
          onChange={handleDateChange}
          className="p-2 border rounded w-full mb-4"
        />
      </div>

      <div className="bg-white shadow-md rounded p-4">
        {filteredEnquiries.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Plant Name</th>
                <th className="border p-2">Contact Person</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry._id} className="text-center">
                  <td className="border p-2">{enquiry.plantName}</td>
                  <td className="border p-2">{enquiry.contactPerson}</td>
                  <td className="border p-2">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleViewClick(enquiry._id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUpdateClick(enquiry._id)}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No enquiries found</p>
        )}
      </div>
    </div>
  );
};
