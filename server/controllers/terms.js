const Term = require('../models/Terms'); // Import the Term model

exports.createTerms = async (req, res) => {
  try {
    const { delivery, paymentTerms, gst, packingForwarding, for: FOR, freightInsurance, validity } = req.body;

    // Check if terms already exist
    const existingTerms = await Term.findOne();
    if (existingTerms) {
      return res.status(400).json({
        success: false,
        message: "Only one set of terms is allowed. Please update the existing terms.",
      });
    }

    // Validate the required fields
    if (!delivery || !paymentTerms || !gst || !validity) {
      return res.status(400).json({
        success: false,
        message: "Delivery, Payment Terms, GST, and Validity are required fields.",
      });
    }

    // Create the terms
    const newTerms = await Term.create({
      delivery,
      paymentTerms,
      gst,
      packingForwarding,
      for: FOR,
      freightInsurance,
      validity,
    });

    return res.status(201).json({
      success: true,
      message: "Terms created successfully.",
      terms: newTerms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the terms.",
      error: error.message,
    });
  }
};


  // Get a specific term by ID
  exports.getTerm = async (req, res) => {
    try {
    
      const term = await Term.findOne(); // Find term by ID
  
      if (!term) {
        return res.status(404).json({
          success: false,
          message: "Term not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Term fetched successfully.",
        term,
      });
    } catch (error) {
      console.error("Error fetching term:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching the term.",
        error: error.message,
      });
    }
  };
  


// Update Terms and Conditions by ID
exports.updateTerms = async (req, res) => {
    try {
      const { id } = req.params; // Extract ID from URL params
      const { delivery, paymentTerms, gst, packingForwarding, for: FOR, freightInsurance, validity } = req.body;
  
      // Validate the required fields
      if (!delivery || !paymentTerms || !gst || !validity) {
        return res.status(400).json({
          success: false,
          message: "Delivery, Payment Terms, GST, and Validity are required fields.",
        });
      }
  
      // Find the term by ID and update
      const updatedTerm = await Term.findByIdAndUpdate(
        id,
        {
          delivery,
          paymentTerms,
          gst,
          packingForwarding,
          for: FOR,
          freightInsurance,
          validity,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedTerm) {
        return res.status(404).json({
          success: false,
          message: "Term not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Terms updated successfully.",
        term: updatedTerm,
      });
    } catch (error) {
      console.error("Error updating terms:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the terms.",
        error: error.message,
      });
    }
  };

  

// Delete Terms and Conditions by ID
exports.deleteTerms = async (req, res) => {
    try {
      const { id } = req.params; // Extract ID from URL params
  
      // Find the term by ID and delete
      const deletedTerm = await Term.findByIdAndDelete(id);
  
      if (!deletedTerm) {
        return res.status(404).json({
          success: false,
          message: "Term not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Term deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting terms:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the terms.",
        error: error.message,
      });
    }
  };
  


// ✅ Create or Update Custom Terms
exports.createOrUpdateCustomTerms = async (req, res) => {
    try {
        const { customTerms } = req.body;

        // ✅ Validate that at least one term is provided
        if (!customTerms || !Array.isArray(customTerms) || customTerms.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one custom term is required",
            });
        }

        // ✅ Validate each term (name & description required)
        for (const term of customTerms) {
            if (!term.name || !term.description) {
                return res.status(400).json({
                    success: false,
                    message: "Each term must have a name and description",
                });
            }
        }

        // ✅ Create or Update Terms
        const termDoc = await Term.findOneAndUpdate(
            {}, // Add condition if updating a specific doc
            { customTerms },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "Custom terms saved successfully",
            data: termDoc,
        });
    } catch (error) {
        console.error("Error saving custom terms:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save custom terms",
            error: error.message,
        });
    }
};


exports.getAllCustomTerms = async (req, res) => {
  try {
      // Fetch all custom terms from the database
      const terms = await Term.find();

      if (!terms || terms.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No custom terms found",
          });
      }

      res.status(200).json({
          success: true,
          message: "Custom terms fetched successfully",
          data: terms,
      });
  } catch (error) {
      console.error("Error fetching custom terms:", error);
      res.status(500).json({
          success: false,
          message: "Failed to fetch custom terms",
          error: error.message,
      });
  }
};