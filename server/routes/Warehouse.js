// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers
const {
  createWarehouse,
  getAllWarehouses,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouse/warehouse");

const {
  addProductToWarehouse,
  updateProducts,
  deleteProduct
} = require("../controllers/Product");

const {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/Product")

const { auth , isAdmin } = require("../middlewares/auth")


// ********************************************************************************************************
//                                      Warehouse Routes
// ********************************************************************************************************
// Route for creating a warehouse (without products)
router.post("/create",auth,createWarehouse);

// Route for getting all warehouses
router.get("/all",auth, getAllWarehouses);

// Route for updating a warehouse (ID passed in the body)
router.put("/update",auth,updateWarehouse);

// Route for deleting a warehouse (ID passed in the body)
router.delete("/delete",auth,deleteWarehouse);


router.post("/add-product",auth,addProductToWarehouse);
// Export the router for use in the main application
router.put("/update-product",auth,updateProducts);


router.post('/add-category',addCategory);
router.put('/update-category/:id',updateCategory);
router.delete('/delete-category/:id',deleteCategory);
router.get('/get-all-categories',getAllCategories);

router.delete("/delete-product",auth,deleteProduct);


module.exports = router;
