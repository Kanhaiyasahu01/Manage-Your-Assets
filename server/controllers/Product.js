const Product = require('../models/Product'); // Assuming your product schema is in models/Product.js
const Warehouse = require('../models/Warehouse'); // Assuming your warehouse schema is in models/Warehouse.js
const Category = require('../models/Category');
// Controller function to add a new product to the warehouse
exports.addProductToWarehouse = async (req, res) => {
  try {
    const {
      warehouseId, // Get warehouse ID from the request body
      name,
      code,
      category,
      subCategory,
      retailPrice,
      purchaseOrderPrice,
      stockUnit,
      alertQuantity,
      tax, // Tax in percentage (stored for later use in order calculations)
      discount, // Discount in percentage (stored for later use in order calculations)
      measuringUnit,
      description,
      validTo,
    } = req.body;

    // Check if required fields are provided
    if (!warehouseId || !name || !retailPrice || !purchaseOrderPrice) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse ID, product name, retail price, and purchase order price are required',
      });
    }

    // Create the new product in the database
    const newProduct = await Product.create({
      name,
      code,
      category,
      subCategory,
      retailPrice,
      purchaseOrderPrice,
      stockUnit,
      alertQuantity,
      tax, // Store the tax percentage
      discount, // Store the discount percentage
      measuringUnit,
      description,
      validTo,
    });

    // Step to update the warehouse document with the new product's ID
    await Warehouse.findByIdAndUpdate(
      warehouseId,
      { $push: { warehouseProducts: newProduct._id } }, // Push the new product ID to the warehouseProducts array
      { new: true } // Return the updated warehouse document
    );

    // Respond with success and the created product
    return res.status(201).json({
      success: true,
      message: 'Product added successfully to the warehouse',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error adding product to warehouse:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while adding the product to the warehouse',
      error: error.message,
    });
  }
};


// update products with some data
exports.updateProducts = async (req, res) => {
  try {
    const { id, retailPrice, purchaseOrderPrice, stockUnit, alertQuantity, tax, discount } = req.body;
    
    // Find the existing product by ID
    const existingProduct = await Product.findById(id);

    // Check if the product exists
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product does not exist",
      });
    }

    // Update the product details
    existingProduct.retailPrice = retailPrice;
    existingProduct.purchaseOrderPrice = purchaseOrderPrice;
    existingProduct.stockUnit = stockUnit;
    existingProduct.alertQuantity = alertQuantity;
    existingProduct.tax = tax;
    existingProduct.discount = discount;

    // Save the updated product
    await existingProduct.save();

    // Respond with success

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: existingProduct, // Return the updated product details
    });

  } catch (err) {
    // Handle any unexpected errors
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { productId, warehouseId } = req.body; // Destructure productId and warehouseId from the request body

    // Ensure that both IDs are provided
    if (!productId || !warehouseId) {
      return res.status(400).json({ message: "Product ID and Warehouse ID are required." });
    }

    // Delete product from the Product database
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(400).json({
        success: false,
        message: "Unable to delete product",
      });
    }

    // Remove the productId from the warehouse's warehouseProducts array
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      { $pull: { warehouseProducts: { _id: productId } } }, // Ensure to pull the correct product by its ID
      { new: true } // Return the updated warehouse document
    );


    if (!updatedWarehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found.",
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully.", 
      deletedProduct ,
      updatedWarehouse,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({success:false, message: "Internal server error." });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { category, description } = req.body;

    // Validate required fields
    console.log("inside backend of create category");
    if (!category || !description) {
      return res.status(400).json({
        success: false,
        message: "Category and description are required",
      });
    }


    // Create new category
    const newCategory = await Category.create({ category, description });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory, // Include the created category in response
    });

  } catch (err) {
    console.error("Error creating category:", err); // Log error for debugging
    return res.status(500).json({
      success: false,
      message: "Unable to create category",
      error: err.message, // Include error message for debugging
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    console.log("inside backend of all categories");
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });

  } catch (err) {
    console.error("Error fetching categories:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories",
      error: err.message,
    });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const { category, description } = req.body;
    console.log("inside backend of update");
    if (!category || !description) {
      return res.status(400).json({
        success: false,
        message: "Category and description are required",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category, description },
      { new: true, runValidators: true }
    );


    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });

  } catch (err) {
    console.error("Error updating category:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to update category",
      error: err.message,
    });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("inside backend of delete");
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (err) {
    console.error("Error deleting category:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to delete category",
      error: err.message,
    });
  }
};