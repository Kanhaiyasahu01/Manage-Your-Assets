const mongoose = require("mongoose");

// CustomField schema
const customFieldSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
});

const CustomField = mongoose.model("CustomField", customFieldSchema);

// AdditionalDetails schema
const additionalDetailsSchema = new mongoose.Schema({
    tax: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    plantName: {
        type: String,
        required:true,
    },
    customFields: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CustomField",
        }
    ],
});

const AdditionalDetails = mongoose.model("AdditionalDetails", additionalDetailsSchema);

module.exports = {
    CustomField,
    AdditionalDetails,
};
