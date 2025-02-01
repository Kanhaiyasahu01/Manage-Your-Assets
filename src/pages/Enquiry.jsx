import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEnquiryService } from '../services/operations/enquiry';

export const Enquiry = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    plantName: '',
    contactPerson: '',
    materialRequired: [{ name: '', quantity: '' }],
    termsAndConditions: [''],
    note: '',
  });

  // Update form field values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update materialRequired array
  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = formData.materialRequired.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setFormData({ ...formData, materialRequired: updatedMaterials });
  };

  // Add new material row
  const addMaterial = () => {
    setFormData({
      ...formData,
      materialRequired: [...formData.materialRequired, { name: '', quantity: '' }],
    });
  };

  // Update termsAndConditions array
  const handleTermChange = (index, value) => {
    const updatedTerms = formData.termsAndConditions.map((term, i) =>
      i === index ? value : term
    );
    setFormData({ ...formData, termsAndConditions: updatedTerms });
  };

  // Add new term row
  const addTerm = () => {
    setFormData({
      ...formData,
      termsAndConditions: [...formData.termsAndConditions, ''],
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEnquiryService(token, formData, navigate));
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Enquiry Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Plant Name</label>
            <input
              type="text"
              name="plantName"
              value={formData.plantName}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">User Name</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Materials Required</label>
            {formData.materialRequired.map((material, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Material Name"
                  value={material.name}
                  onChange={(e) =>
                    handleMaterialChange(index, 'name', e.target.value)
                  }
                  className="w-1/2 p-2 border rounded-md"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={material.quantity}
                  onChange={(e) =>
                    handleMaterialChange(index, 'quantity', e.target.value)
                  }
                  className="w-1/2 p-2 border rounded-md"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addMaterial}
              className="text-blue-600 text-sm mt-1"
            >
              + Add Material
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Terms and Conditions</label>
            {formData.termsAndConditions.map((term, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  placeholder="Enter term"
                  value={term}
                  onChange={(e) => handleTermChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTerm}
              className="text-blue-600 text-sm mt-1"
            >
              + Add Term
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  );
};
