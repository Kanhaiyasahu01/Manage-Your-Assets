// Import required models
const Supplier = require("../models/Supplier");
const Address = require("../models/Address");
const {CustomField,AdditionalDetails} = require("../models/AdditionalDetails")
const SupplierOrder = require("../models/SupplierOrder");
const InvoiceDetails = require("../models/InvoiceDetails");
const Product = require("../models/Product");
const mongoose = require('mongoose');
// Controller for creating a Billing/Shipping Address
exports.createAddress = async (req, res) => {
  console.log("inside create address controller")
  try {
      const { name, company, phone, email, address, city,state, country, postbox } = req.body;
console.log("inside create address controller")
      // Validate required fields
      if (!name || !company || !phone || !email || !city || !state || !country) {
          return res.status(400).json({
              success: false,
              message: "Name, company, phone, email, city, and country are required fields",
          });
      }

      // Create the address
      const newAddress = await Address.create({
          name,
          company,
          phone,
          email,
          address,
          city,
          state,
          country,
          postbox,
      });
      console.log("Address created billing")
      // Respond with success
      return res.status(201).json({
          success: true,
          message: "Address created successfully",
          address: newAddress,
      });
  } catch (error) {
      console.error("Error creating address:", error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while creating the address",
          error: error.message,
      });
  }
};



// Controller for creating Additional Details
exports.createAdditionalDetails = async (req, res) => {
    try {
      const { tax, discount, plantName, customFields } = req.body;
  
      // Validate required fields
      if (!plantName) {
        return res.status(400).json({
          success: false,
          message: "Plant Name is required",
        });
      }
  
      // Check if customFields array is provided, and create the fields
      let customFieldIds = [];
      if (customFields && customFields.length > 0) {
        // Create each custom field and store its ID in the customFieldIds array
        customFieldIds = await Promise.all(
          customFields.map(async (field) => {
            const newCustomField = await CustomField.create({
              name: field.name,
              description: field.description,
            });
            return newCustomField._id;
          })
        );
      }
  
      // Create additional details with the custom field references
      const newAdditionalDetails = await AdditionalDetails.create({
        plantName,
        customFields: customFieldIds,
      });
  
      // Respond with success
      return res.status(201).json({
        success: true,
        message: "Additional details created successfully",
        additionalDetails: newAdditionalDetails,
      });
    } catch (error) {
      console.error("Error creating additional details:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating additional details",
        error: error.message,
      });
    }
  };

  
  exports.createSupplier = async (req, res) => {
    try {
      const {billingAddress, shippingAddress, additionalDetails} = req.body;
  
      // Check if required fields are provided
      if (!billingAddress || !shippingAddress || !additionalDetails) {
        return res.status(400).json({
          success: false,
          message: "Billing address, shipping address, and additional details are required",
        });
      }
  
      // Ensure that the provided IDs exist in their respective collections
      const billingAddressExists = await Address.findById(billingAddress);
      const shippingAddressExists = await Address.findById(shippingAddress);
      const additionalDetailsExists = await AdditionalDetails.findById(additionalDetails);
  
      if (!billingAddressExists || !shippingAddressExists || !additionalDetailsExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid billing address, shipping address, or additional details",
        });
      }
  
      // Create the supplier
      const newSupplier = await Supplier.create({
        billingAddress,
        shippingAddress,
        additionalDetails,
        supplierOrders: [],
        transactions:[],
         // Initialize without orders
      });
  
      // Populate the necessary fields in the newly created supplier
      const populatedSupplier = await Supplier.findById(newSupplier._id)
        .populate('billingAddress')
        .populate('shippingAddress')
        .populate(
            {
                path:"additionalDetails",
                populate:{
                    path:"customFields"
                }
            }
        )
        .lean(); // Optional: use lean for better performance
  
      // Respond with success and populated data
      return res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        supplier: populatedSupplier,
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the supplier",
        error: error.message,
      });
    }
  };
  

  exports.createSupplierOrder = async (req, res) => {
    try {
      const {
        supplier,
        warehouse,
        referenceNumber,
        orderDueDate,
        tax,           // Individual tax for the invoice
        discount,      // Individual discount for the invoice
        productList,
        shipping,
        extraDiscount,
        grandTotal,
        paymentOfTerms,
        isUpdateRequired,
      } = req.body;
  
      // Step 1: Create Invoice Details
      const newInvoice = await InvoiceDetails.create({
        referenceNumber,
        orderDueDate,
        tax,       // Invoice-specific tax
        discount,  // Invoice-specific discount
      });
  
      // Step 2: Create Supplier Order with the invoice ID
      const newSupplierOrder = await SupplierOrder.create({
        supplier,
        warehouse,
        invoiceDetails: newInvoice._id,  // Reference to the created invoice
        productList,
        shipping,
        extraDiscount,
        grandTotal,
        paymentOfTerms,
        isUpdateRequired,
      });
  
      // Step 3: Update Supplier model's supplierOrders array with the new SupplierOrder ID
      const supplierData = await Supplier.findById(supplier);
      if (supplierData) {
        supplierData.supplierOrders.push(newSupplierOrder._id);  // Add the new SupplierOrder ID to the supplierOrders array
        await supplierData.save();  // Save the updated supplier data
      } else {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }
  
      // Step 4: Conditionally update stock if `isUpdateRequired` is true
      if (isUpdateRequired) {
        for (const item of productList) {
          const product = await Product.findById(item.product);
          if (product) {
            // Ensure that stockUnit and quantity are treated as numbers
            const updatedStock = Number(product.stockUnit || 0) + Number(item.quantity || 0);
            product.stockUnit = updatedStock;  // Update stock with the new quantity
            await product.save();  // Save the updated product
          }
        }
      }
  
      // Step 5: Send response
      return res.status(201).json({
        success: true,
        message: "Supplier order created successfully",
        supplierOrder: newSupplierOrder,
      });
    } catch (error) {
      console.error("Error creating supplier order:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the supplier order",
        error: error.message,
      });
    }
  };
  

exports.getAllSuppliers = async (req, res) => {
  try {
    // Fetch all suppliers from the database and populate related fields if necessary
    const suppliers = await Supplier.find().populate('billingAddress shippingAddress additionalDetails');
  
    return res.status(200).json({
      success: true,
      message: "Suppliers retrieved successfully",
      suppliers,
    });
  } catch (error) {
    console.error("Error while fetching suppliers:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching suppliers",
      error: error.message,
    });
  }
};



exports.updateAddress = async (req, res) => {
  try {
    const { _id, name, company, phone, email, address, city, country, postbox } = req.body;
    
    // Validate required fields
    if (!_id || !name || !company || !phone || !email || !city || !country) {
      return res.status(400).json({
        success: false,
        message: "Id, Name, company, phone, email, city, and country are required fields",
      });
    }

    // Find and update the address
    const updatedAddress = await Address.findByIdAndUpdate(
      _id,
      { name, company, phone, email, address, city, country, postbox },
      { new: true } // Return the updated document
    );

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the address",
      error: error.message,
    });
  }
};


exports.updateAdditionalDetails = async (req, res) => {
  try {
    const { _id, tax, discount, documentId, customFields } = req.body;

    // Validate required fields
    if (!_id || !documentId) {
      return res.status(400).json({
        success: false,
        message: "ID and Document ID are required",
      });
    }

    // Check if customFields array is provided, and update the fields
    let customFieldIds = [];
    if (customFields && customFields.length > 0) {
      // Update each custom field and store its ID in the customFieldIds array
      customFieldIds = await Promise.all(
        customFields.map(async (field) => {
          const updatedCustomField = await CustomField.findByIdAndUpdate(
            field._id,
            {
              name: field.name,
              description: field.description,
            },
            { new: true }
          );
          return updatedCustomField._id;
        })
      );
    }

    // Update additional details with the custom field references
    const updatedAdditionalDetails = await AdditionalDetails.findByIdAndUpdate(
      _id,
      {
        tax,
        discount,
        documentId,
        customFields: customFieldIds,
      },
      { new: true }
    );

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Additional details updated successfully",
      additionalDetails: updatedAdditionalDetails,
    });
  } catch (error) {
    console.error("Error updating additional details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating additional details",
      error: error.message,
    });
  }
};


exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Received body:", id); // Log the entire request body

    // Check if the id is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a supplier ID.",
      });
    }

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid supplier ID format.", // Corrected 'client' to 'supplier'
      });
    }

    // Find the supplier by ID and delete it
    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    // If supplier was not found or couldn't be deleted
    if (!deletedSupplier) {
      return res.status(404).json({ // Changed to 404 for not found
        success: false,
        message: "Unable to delete supplier. Supplier not found.",
      });
    }

    // Successfully deleted
    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully.",
    });

  } catch (err) {
    // Error handling
    console.error("Error deleting Supplier:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the supplier.",
    });
  }
};

exports.fetchAllSupplierOrders = async (req, res) => {
  try {
    const allSupplierOrders = await SupplierOrder.find()
      .populate({
        path:"supplier",
        populate:{
          path:"supplierOrders"
        }
      })
      .populate({
        path:"supplier",
        populate:{
          path:"billingAddress",
        }
      }) // Populate supplier data
      .populate("warehouse") // Populate warehouse data
      // .populate("invoiceDetails") // Populate invoice details
      .populate({
        path: "productList.product", // Populate product inside productList array
        model: "Product",
      })
      .lean(); // Use lean to get plain JavaScript objects

    if (!allSupplierOrders || allSupplierOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No supplier orders found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched all supplier orders",
      allSupplierOrders,
    });
  } catch (err) {
    console.error("Error fetching supplier orders:", err);  // Add error logging
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching supplier orders",
    });
  }
};

exports.deleteSupplierOrderById = async (req, res) => {
  try {
    const { orderId, supplierId } = req.body;

    // Validate input
    if (!orderId || !supplierId) {
      return res.status(400).json({
        success: false,
        message: "Order ID and Supplier ID are required",
      });
    }

    // Delete the supplier order
    const deletedOrder = await SupplierOrder.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Supplier order not found or not able to delete",
      });
    }

    // Update the supplier to remove the deleted order
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      supplierId,
      {
        $pull: { supplierOrders: orderId }, // Ensure you're pulling the correct order ID
      },
      { new: true } // Return the updated supplier document
    );

    if (!updatedSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found or unable to update",
      });
    }

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Supplier order deleted successfully",
      deletedOrder,
      updatedSupplier, // Optionally include the updated supplier data in the response
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the supplier order",
      error: err.message,
    });
  }
};


exports.getSupplierOrderById = async (req, res) => {
  try {
    const { id } = req.params; // Use req.params to get the ID from the URL
    const orderDetails = await SupplierOrder.findById(id)
    .populate({
      path: "supplier", // First populate the client object
      populate: { 
        path: "billingAddress", // Only populate the billingAddress field
        model: "Address" 
      }
    })
    .populate("warehouse") // Populate warehouse data
    .populate({
      path: "productList.product", // Populate product inside productList array
      model: "Product",
    })
    .lean(); 
    
    console.log("inside backend", id);

    if (!orderDetails) {
      return res.status(404).json({
        success: false,
        message: "Order details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      orderDetails,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details",
    });
  }
};

