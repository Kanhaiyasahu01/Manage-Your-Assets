// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers
const {
  createSupplier,            // Controller to create a supplier (without order list)
  createAddress,             // Controller to create a billing/shipping address
  updateAddress,
  updateAdditionalDetails,
  createAdditionalDetails,   // Controller to create additional details
  createSupplierOrder,
  getAllSuppliers,
  deleteSupplier,
  fetchAllSupplierOrders,
  deleteSupplierOrderById,
  getSupplierOrderById
} = require("../controllers/Supplier");

const { auth , isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Supplier Routes
// ********************************************************************************************************
// Route for creating a supplier (without orders)
router.post("/create",auth,createSupplier);

// Route for creating a billing or shipping address
router.post("/address/create",auth,createAddress);
router.put("/address/update/:id",auth,updateAddress);

// Route for creating additional details
router.post("/additional-details/create",auth,createAdditionalDetails);
router.put("/additional-details/update/:id",auth,updateAdditionalDetails);

router.post('/create-supplier-order',auth,createSupplierOrder);
// Export the router for use in the main application
router.get('/get-all-suppliers',auth,getAllSuppliers);

router.delete('/delete-supplier',auth,deleteSupplier)

router.get('/get-all-orders',auth,fetchAllSupplierOrders)

router.delete('/delete-order',auth,deleteSupplierOrderById)

router.get('/get-order-details/:id',auth,getSupplierOrderById)
module.exports = router;
