import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { addClientService } from "../services/operations/client"
export const AddClient = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const {token} = useSelector((state) => state.auth)
  const {clients} = useSelector((state)=>state.client)
  const [loading ,setLoading] = useState(false);

  // useState for formData of each section
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state:"",
    country: "",
    postbox: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state:"",
    country: "",
    postbox: "",
  });

  const [additionalDetails, setAdditionalDetails] = useState({
    tax: "",
    discount: "",
    plantName: "",
    customFields: [],
  });

  // To add custom fields dynamically
  const [customField, setCustomField] = useState({ name: "", description: "" });

  // Tab management state
  const [activeTab, setActiveTab] = useState("billing"); // billing, shipping, additional

  // Copy billing address to shipping address
  const copyBillingToShipping = () => {
    setShippingAddress({ ...billingAddress });
  };

  // Handle form change for Billing, Shipping and Additional Details
  const handleBillingChange = (e) => {
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleAdditionalChange = (e) => {
    setAdditionalDetails({
      ...additionalDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Add custom field to additional details
  const addCustomField = () => {
    setAdditionalDetails({
      ...additionalDetails,
      customFields: [...additionalDetails.customFields, customField],
    });
    setCustomField({ name: "", description: "" }); // Clear the input after adding
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      billingAddress,
      shippingAddress,
      additionalDetails,
    };
console.log(billingAddress);
console.log(shippingAddress);
console.log(additionalDetails)
    // Perform API request with formData

    dispatch(addClientService(token,clients,billingAddress,shippingAddress,additionalDetails,formData));

    console.log(formData);
    // Submit the form data to backend API using fetch/axios
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full ">
        <div className="flex justify-start mb-6">
          <div className="text-3xl font-bold text-gray-800">
            Add New Customer
          </div>
        </div>

        {/* Tabs for navigation */}
        <div className="flex justify-between mb-6 w-2/3">
          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2 ${
              activeTab === "billing" ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded`}
          >
            Billing Address
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 ${
              activeTab === "shipping"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            } rounded`}
          >
            Shipping Address
          </button>
          <button
            onClick={() => setActiveTab("additional")}
            className={`px-4 py-2 ${
              activeTab === "additional"
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            } rounded`}
          >
            Add Plant Details
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Billing Address Tab */}
          {activeTab === "billing" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Billing Address</h3>
              <div className="flex flex-col space-y-4">
                {Object.keys(billingAddress).map((key) => (
                  <div className="flex justify-between items-center" key={key}>
                    <label
                      className="w-1/4 text-left font-semibold pl-6"
                      htmlFor={key}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      name={key}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={billingAddress[key]}
                      onChange={handleBillingChange}
                      className="w-3/4 mb-2 p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-row justify-end items-center w-full ">
                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab("shipping")}
                  className="bg-blue-500 text-white px-4 py-2 mt-4 rounded w-1/5"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Shipping Address Tab */}
          {activeTab === "shipping" && (
            <div>
              <div className="flex flex-row gap-10 items-center my-3">
                <h3 className="text-lg font-bold mb-4">Shipping Address</h3>
                <button
                  type="button"
                  onClick={copyBillingToShipping}
                  className="bg-caribbeangreen-400 text-white px-4 py-2 mb-4 rounded"
                >
                  Copy Billing Address
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                {Object.keys(shippingAddress).map((key) => (
                  <div className="flex justify-between items-center" key={key}>
                    <label
                      className="w-1/4 pl-6 text-left font-semibold"
                      htmlFor={key}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      name={key}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={shippingAddress[key]}
                      onChange={handleShippingChange}
                      className="w-3/4 mb-2 p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-row justify-end items-center w-full ">
                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab("additional")}
                  className="bg-blue-500 text-white px-4 py-2 mt-4 rounded w-1/5"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Additional Details Tab */}
          {activeTab === "additional" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Plant Details</h3>
              <div className="flex flex-col space-y-4">
                {/* <div className="flex justify-between items-center">
                  <label
                    className="w-1/4 text-left font-semibold"
                    htmlFor="tax"
                  >
                    Tax
                  </label>
                  <input
                    type="number"
                    name="tax"
                    placeholder="Tax ID"
                    value={additionalDetails.tax}
                    onChange={handleAdditionalChange}
                    className="w-3/4 mb-2 p-2 border border-gray-300 rounded"
                  />
                </div> */}
                {/* <div className="flex justify-between items-center">
                  <label
                    className="w-1/4 text-left font-semibold"
                    htmlFor="discount"
                  >
                    Discount
                  </label>
                  <input
                    type="number"
                    name="discount"
                    placeholder="Discount"
                    value={additionalDetails.discount}
                    onChange={handleAdditionalChange}
                    className="w-3/4 mb-2 p-2 border border-gray-300 rounded"
                  />
                </div> */}
                <div className="flex justify-between items-center">
                  <label
                    className="w-1/4 text-left font-semibold"
                    htmlFor="plantName"
                  >
                    Plant Name
                  </label>
                  <input
                    type="text"
                    name="plantName"
                    placeholder="Plant Name"
                    value={additionalDetails.plantName}
                    onChange={handleAdditionalChange}
                    className="w-3/4 mb-2 p-2 border border-gray-300 rounded"
                  />
                </div>
                {/* Custom Fields */}
                <h4 className="font-bold mt-4">Add more fields</h4>
                <input
                  type="text"
                  name="name"
                  placeholder="Field Name"
                  value={customField.name}
                  onChange={(e) =>
                    setCustomField({ ...customField, name: e.target.value })
                  }
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Field Description"
                  value={customField.description}
                  onChange={(e) =>
                    setCustomField({
                      ...customField,
                      description: e.target.value,
                    })
                  }
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
             <div className="w-full flex flex-row justify-start pr-3 ">
                <button
                    type="button"
                    onClick={addCustomField}
                    className="bg-blue-500 text-white px-4 py-2 mb-4 rounded w-1/5"
                    >
                    Add Field
                </button>
             </div>

                {/* Display Custom Fields */}
                <div className="mt-4">
                  {additionalDetails.customFields.length > 0 ? (
                    additionalDetails.customFields.map((field, index) => (
                      <div key={index} className="bg-gray-100 p-2 mb-2 rounded">
                        <strong>{field.name}</strong>: {field.description}
                      </div>
                    ))
                  ):(<br/>)}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-row justify-center items-center w-full ">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded w-1/5"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};