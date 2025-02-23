import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import invoiceHeader from "../assets/invoiceHeader.jpeg";
import invoiceFooter from "../assets/invoiceFooter.png";
import { apiConnector } from "../services/apiconnector";
import { termsEndPoints } from "../services/apis";
import { fetchOrderService } from "../services/operations/client";

export const PrintOrderComponent = forwardRef((props, ref) => {
  const { GET_CUSTOM_TERM } = termsEndPoints;
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState(null);
  const [termsData, setTermsData] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState({
    serialNo: true,
    productName: true,
    quantity: true,
    price: true,
    tax: true,
    discount: true,
    netPrice: true,
  });

  // ✅ Fetch order data
  useEffect(() => {
    if (id) {
      dispatch(fetchOrderService(token, id, setOrderData));
    }
  }, [id, token, dispatch]);

  // ✅ Fetch terms data
  useEffect(() => {
    fetchExistingTerms();
  }, []);

  const fetchExistingTerms = async () => {
    try {
      const response = await apiConnector("GET", GET_CUSTOM_TERM, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("terms", response);

      // ✅ Extract customTerms correctly
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setTermsData(response.data.data[0].customTerms); // Assuming the custom terms are in an array
      } else {
        console.error("No custom terms found");
      }
    } catch (error) {
      console.error("Error fetching terms:", error.message);
    }
  };

  // ✅ Handle checkbox change
  const handleCheckboxChange = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  if (!orderData) {
    return <p>Loading Order Data...</p>;
  }

  return (
    <div>
      {/* Checkbox Options for Selecting Columns */}
      <div className="checkbox-container p-4 rounded-lg flex justify-center gap-6 mb-4">
        {Object.keys(selectedColumns).map((key) => (
          <label key={key} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selectedColumns[key]}
              onChange={() => handleCheckboxChange(key)}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-gray-800 font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </label>
        ))}
      </div>

      {/* Printable Content */}
      <div
        ref={ref}
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          width: "800px",
          margin: "auto",
          border: "1px solid #ccc",
        }}
        className="bg-white"
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }} className="border w-full">
          <img src={invoiceHeader} alt="Invoice Header" style={{ width: "100%" }} />
        </div>

        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px", marginBottom: "20px" }}>Order</h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ width: "48%" }}>
            <p><strong>To:</strong></p>
            <p>{orderData.client?.billingAddress?.company || "No company available"}</p>
            <p>{orderData.client?.billingAddress?.address || "No Address available"}</p>
            <p>{orderData.client?.billingAddress?.city}, {orderData.client?.billingAddress?.country}, {orderData.client?.billingAddress?.postbox}</p>
          </div>

          <div style={{ width: "48%", textAlign: "right" }}>
            <p><strong>Order Number:</strong> {orderData.invoiceDetails.invoiceNumber}</p>
            <p><strong>Order Date:</strong> {new Date(orderData.invoiceDetails.orderDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p><strong>Ref:</strong> Through Mail</p>
          <p>Dear Sir,</p>
          <p>Thank you for your order. We are pleased to confirm your order with the following details:</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <table border="1" width="100%" cellPadding="10" cellSpacing="0" style={{ borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr className="bg-blue-600 text-white">
                {selectedColumns.serialNo && <th>S.No</th>}
                {selectedColumns.productName && <th>Product Name</th>}
                {selectedColumns.quantity && <th>Quantity</th>}
                {selectedColumns.price && <th>Price</th>}
                {selectedColumns.tax && <th>Tax</th>}
                {selectedColumns.discount && <th>Discount</th>}
                {selectedColumns.netPrice && <th>Net Price/UOM</th>}
              </tr>
            </thead>
            <tbody>
              {orderData.productList.map((item, index) => (
                <tr key={index}>
                  {selectedColumns.serialNo && <td>{index + 1}</td>}
                  {selectedColumns.productName && <td>{item?.product?.name || "No description"}</td>}
                  {selectedColumns.quantity && <td>{item?.quantity}</td>}
                  {selectedColumns.price && <td>{item?.product?.retailPrice}</td>}
                  {selectedColumns.tax && <td>{item?.product?.tax}</td>}
                  {selectedColumns.discount && <td>{item?.product?.discount}</td>}
                  {selectedColumns.netPrice && <td>{item?.priceAtOrder}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full justify-end items-center">
          <p className="text-lg font-semibold text-gray-800">
            Grand Total: <span className="text-xl font-bold text-green-600">{orderData.grandTotal}</span>
          </p>
        </div>

 {/* ✅ Dynamic Terms and Conditions */}
{termsData && termsData.length > 0 && (
  <div className="mt-5 rounded-md shadow-sm text-xs leading-tight">
    <h5 className="font-semibold text-sm">Terms and Conditions:</h5>
    <ul className="pl-10 list-disc space-y-2">
      {termsData.map((term, index) => (
        <li key={index} className="flex gap-4">
          <span className="font-semibold w-1/4">{term.name}:</span>
          <span className="text-gray-700 w-3/4">{term.description}</span>
        </li>
      ))}
    </ul>

    <p className="mt-4 text-gray-700 text-xs">
      We hope you shall find our offer in line with your requirement and shall favour us with your valued Purchase Order. In case of any queries/clarifications required, please feel free to contact us. We assure you of prompt action on the same.
    </p>

    <p className="mt-4 text-gray-700 text-xs">
      Meanwhile, thanking you and assuring you the best of our attention and services at all times.
    </p>
  </div>
)}


        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img src={invoiceFooter} alt="Invoice Footer" style={{ width: "100%" }} />
        </div>
      </div>

      <style>
        {`
        @media print {
          .checkbox-container {
            display: none;
          }
        }
        `}
      </style>
    </div>
  );
});
