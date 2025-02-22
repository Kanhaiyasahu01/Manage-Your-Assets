import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import invoiceHeader from "../assets/invoiceHeader.jpeg";
import invoiceFooter from "../assets/invoiceFooter.png";
import { apiConnector } from "../services/apiconnector";
import { termsEndPoints } from "../services/apis";
import { fetchOrderService } from "../services/operations/client";
export const PrintOrderComponent = forwardRef((props, ref) => {
  const { GET } = termsEndPoints;
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState(null);
  const [termsData, setTermsData] = useState(null);

  // State for managing which columns are selected for printing
  const [selectedColumns, setSelectedColumns] = useState({
    serialNo: true,
    productName: true,
    quantity: true,
    price: true,
    tax: true,
    discount: true,
    netPrice: true,
  });

  // Fetch order data
  useEffect(() => {
    if (id) {
      dispatch(fetchOrderService(token, id, setOrderData));
    }
    console.log("order data", orderData);
  }, [id, token, dispatch]);

  // Fetch terms data
  useEffect(() => {
    fetchExistingTerms();
  }, []);

  const fetchExistingTerms = async () => {
    try {
      const response = await apiConnector("GET", GET, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("terms", response);

      if (response.data.term) {
        setTermsData(response.data.term);
      }
    } catch (error) {
      console.error("Error fetching terms:", error.message);
    }
  };

  // Handle checkbox change
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
      <div className="checkbox-container  p-4 rounded-lg flex justify-center gap-6 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.serialNo}
            onChange={() => handleCheckboxChange("serialNo")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Serial No</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.productName}
            onChange={() => handleCheckboxChange("productName")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Product Name</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.quantity}
            onChange={() => handleCheckboxChange("quantity")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Quantity</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.price}
            onChange={() => handleCheckboxChange("price")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Price</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.tax}
            onChange={() => handleCheckboxChange("tax")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Tax</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.discount}
            onChange={() => handleCheckboxChange("discount")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Discount</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedColumns.netPrice}
            onChange={() => handleCheckboxChange("netPrice")}
            className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="ml-2 text-gray-800 font-medium">Net Price/UOM</span>
        </label>
      </div>
      {/* Below is the printable things */}
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
        <div
          style={{ textAlign: "center", marginBottom: "20px" }}
          className="border w-full"
        >
          <img
            src={invoiceHeader}
            alt="Invoice Header"
            style={{ width: "100%" }}
          />
        </div>

        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          Order
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div style={{ width: "48%" }}>
            <p>
              <strong>To:</strong>
            </p>
            <p className="pl-6">
              {orderData.client?.billingAddress?.company ||
                "No company available"}
            </p>
            <p className="pl-6">
              {orderData.client?.billingAddress?.address ||
                "No Address available"}
            </p>
            <p className="pl-6">
              {orderData.client?.billingAddress?.city},{" "}
              {orderData.client?.billingAddress?.country},{" "}
              {orderData.client?.billingAddress?.postbox}
            </p>
          </div>

          <div style={{ width: "48%", textAlign: "right" }}>
            <p>
              <strong>Order Number:</strong>{" "}
              {orderData.invoiceDetails.invoiceNumber}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(
                orderData.invoiceDetails.orderDate
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Ref:</strong> Through Mail
          </p>
          <p className="pl-6">Dear Sir,</p>
          <p className="pl-6">
            Thank you for your order. We are pleased to confirm your order with
            the following details:
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <table
            border="1"
            width="100%"
            cellPadding="10"
            cellSpacing="0"
            style={{
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{ fontWeight: "bold" }}
                className="bg-blue-600 text-white"
              >
                {selectedColumns.serialNo && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  >
                    S.No
                  </th>
                )}
                {selectedColumns.productName && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                    }}
                  >
                    Product Name
                  </th>
                )}
                {selectedColumns.quantity && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  >
                    Quantity
                  </th>
                )}
                {selectedColumns.price && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  >
                    Price
                  </th>
                )}
                {selectedColumns.tax && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  >
                    Tax
                  </th>
                )}
                {selectedColumns.discount && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                    }}
                  >
                    Discount
                  </th>
                )}
                {selectedColumns.netPrice && (
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      border: "1px solid #ccc",
                    }}
                  >
                    Net Price/UOM
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orderData.productList.map((item, index) => (
                <tr key={index}>
                  {selectedColumns.serialNo && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                      }}
                    >
                      {index + 1}
                    </td>
                  )}
                  {selectedColumns.productName && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        border: "1px solid #ccc",
                      }}
                    >
                      {item?.product?.name || "No description"}
                    </td>
                  )}
                  {selectedColumns.quantity && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                      }}
                    >
                      {item?.quantity}
                    </td>
                  )}
                  {selectedColumns.price && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                      }}
                    >
                      {item?.product?.retailPrice}
                    </td>
                  )}
                  {selectedColumns.tax && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                      }}
                    >
                      {item?.product?.tax}
                    </td>
                  )}
                  {selectedColumns.discount && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                      }}
                    >
                      {item?.product?.discount}
                    </td>
                  )}
                  {selectedColumns.netPrice && (
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        border: "1px solid #ccc",
                      }}
                    >
                      {item?.priceAtOrder}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex w-full justify-end items-center">
          <p className="text-lg font-semibold text-gray-800">
            Grand Total:{" "}
            <span className="text-xl font-bold text-green-600">
              {orderData.grandTotal}
            </span>
          </p>
        </div>

        {termsData && (
          <div className="mt-5 rounded-md shadow-sm">
            <h5 className=" font-semibold ">Terms and Conditions:</h5>
            <div className="pl-10 flex justify-between">
              <div>
                <p>
                  <span className="font-semibold mr-16">Delivery:</span>
                </p>
                <p>
                  <span className="font-semibold mr-2">Payment Terms:</span>
                </p>
                <p>
                  <span className="font-semibold mr-24">GST:</span>{" "}
                </p>
                <p>
                  <span className="font-semibold mr-20">F.O.R.:</span>
                </p>
                <p>
                  <span className="font-semibold mr-16">
                    Freight & Insurance:
                  </span>{" "}
                </p>
                <p>
                  <span className="font-semibold mr-16">Validity:</span>{" "}
                </p>
                <p>
                  <span className="font-semibold mr-16">
                    Packing & Forwarding:
                  </span>
                </p>
              </div>
              <div>
                <p>{termsData.delivery}</p>
                <p>{termsData.paymentTerms}</p>
                <p>{termsData.gst}</p>
                <p>{termsData.for}</p>
                <p> {termsData.freightInsurance}</p>
                <p>{termsData.validity}</p>
                <p> {termsData.packingForwarding}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700">
              We hope you shall find our offer in line with your requirement and
              shall favour us with your valued Purchase Order. In case of any
              queries/clarifications required, please feel free to contact us.
              We assure you of prompt action on the same.
            </p>

            <p className="mt-4 text-gray-700">
              Meanwhile, thanking you and assuring you the best of our attention
              and services at all times.
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={invoiceFooter}
            alt="Invoice Footer"
            style={{ width: "100%" }}
          />
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
