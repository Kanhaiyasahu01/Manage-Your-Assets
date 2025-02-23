// const mongoose = require("mongoose");

// const termsSchema = new mongoose.Schema({
//     delivery: {
//         type: String,
//         required: true,
//     },
//     paymentTerms: {
//         type: String,
//         required: true,
//     },
//     gst: {
//         type: String,
//         required: true,
//     },
//     packingForwarding: {
//         type: String,
//     },
//     for: {
//         type: String,
//     },
//     freightInsurance: {
//         type: String,
//     },
//     validity: {
//         type: String,
//         required: true,
//     },
// }, { timestamps: true });

// module.exports = mongoose.model("Term", termsSchema);


const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema({
    customTerms: [
        {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("Term", termsSchema);
