const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 20, 
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state:{
        type:String,
        required:true,
    },
    country: {
        type: String,
        required: true,
    },
    postbox: {
        type: String,
    },
});

module.exports = mongoose.model("Address", addressSchema);
