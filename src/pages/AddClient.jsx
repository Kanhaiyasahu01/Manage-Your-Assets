import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addClientService, updateClientService } from "../services/operations/client";

export const AddClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { clients } = useSelector((state) => state.client);
  const [loading, setLoading] = useState(false);

  // Check if client data is passed for update
  const existingClient = location.state?.client || null;

  // States for form fields (store _id and __v internally)
  const [billingAddress, setBillingAddress] = useState({
    _id: "",
    __v: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postbox: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    _id: "",
    __v: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postbox: "",
  });

  const [additionalDetails, setAdditionalDetails] = useState({
    _id: "",
    __v: "",
    tax: "",
    discount: "",
    plantName: "",
    customFields: [],
  });

  const [customField, setCustomField] = useState({ name: "", description: "" });
  const [activeTab, setActiveTab] = useState("billing");

  // ✅ Prefill data if updating (include _id and __v internally)
  useEffect(() => {
    if (existingClient) {
      setBillingAddress(existingClient.billingAddress || {});
      setShippingAddress(existingClient.shippingAddress || {});
      setAdditionalDetails(existingClient.additionalDetails || {});
    }
  }, [existingClient]);

  // Copy billing address to shipping
  const copyBillingToShipping = () => setShippingAddress({ ...billingAddress });

  // Handle input changes
  const handleBillingChange = (e) =>
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });

  const handleShippingChange = (e) =>
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const handleAdditionalChange = (e) =>
    setAdditionalDetails({ ...additionalDetails, [e.target.name]: e.target.value });

  const addCustomField = () => {
    setAdditionalDetails({
      ...additionalDetails,
      customFields: [...additionalDetails.customFields, customField],
    });
    setCustomField({ name: "", description: "" });
  };

  // Submit Handler (Add or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      billingAddress,
      shippingAddress,
      additionalDetails,
    };

    if (existingClient) {
      // ✅ UPDATE CLIENT — Pass _id and __v but don't show in form
      dispatch(updateClientService(token, existingClient._id, formData));
    } else {
      // ✅ ADD CLIENT
      console.log("calling add client");
      dispatch(addClientService(token, clients, billingAddress, shippingAddress, additionalDetails, formData));
    }

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full">
        <div className="flex justify-start mb-6">
          <div className="text-3xl font-bold text-gray-800">
            {existingClient ? "Update Client" : "Add New Client"}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between mb-6 w-2/3">
          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2 ${activeTab === "billing" ? "bg-blue-500 text-white" : "bg-gray-300"} rounded`}
          >
            Billing Address
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 ${activeTab === "shipping" ? "bg-blue-500 text-white" : "bg-gray-300"} rounded`}
          >
            Shipping Address
          </button>
          <button
            onClick={() => setActiveTab("additional")}
            className={`px-4 py-2 ${activeTab === "additional" ? "bg-blue-500 text-white" : "bg-gray-300"} rounded`}
          >
            Plant Details
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Billing Address */}
          {activeTab === "billing" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Billing Address</h3>
              {Object.keys(billingAddress)
                .filter((key) => key !== "_id" && key !== "__v") // Exclude _id and __v
                .map((key) => (
                  <div className="flex justify-between items-center mb-4" key={key}>
                    <label className="w-1/4 text-left font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      name={key}
                      value={billingAddress[key]}
                      onChange={handleBillingChange}
                      className="w-3/4 p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("shipping")}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {activeTab === "shipping" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Shipping Address</h3>
              <button
                type="button"
                onClick={copyBillingToShipping}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
              >
                Copy Billing Address
              </button>
              {Object.keys(shippingAddress)
                .filter((key) => key !== "_id" && key !== "__v") // Exclude _id and __v
                .map((key) => (
                  <div className="flex justify-between items-center mb-4" key={key}>
                    <label className="w-1/4 text-left font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type={key === "email" ? "email" : "text"}
                      name={key}
                      value={shippingAddress[key]}
                      onChange={handleShippingChange}
                      className="w-3/4 p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("additional")}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Additional Details */}
          {activeTab === "additional" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Plant Details</h3>
              <div className="flex justify-between items-center mb-4">
                <label className="w-1/4 text-left font-semibold">Plant Name</label>
                <input
                  type="text"
                  name="plantName"
                  value={additionalDetails.plantName}
                  onChange={handleAdditionalChange}
                  className="w-3/4 p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Custom Fields */}
              <h4 className="font-bold mt-4">Add Custom Fields</h4>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Field Name"
                  value={customField.name}
                  onChange={(e) => setCustomField({ ...customField, name: e.target.value })}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Field Description"
                  value={customField.description}
                  onChange={(e) => setCustomField({ ...customField, description: e.target.value })}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="button"
                onClick={addCustomField}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Field
              </button>

              {/* Display Custom Fields */}
              <div className="mt-4">
                {additionalDetails.customFields.map((field, index) => (
                  <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                    <strong>{field.name}</strong>: {field.description}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                  {existingClient ? "Update Client" : "Add Client"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
