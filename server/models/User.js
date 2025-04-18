const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String, 
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Sales","Stock","Marketing","Other"],
        required:true,
    },
    token: {
		type: String,
	},
	resetPasswordExpires: {
		type: Date,
	},
    address:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    gstIn:{
        type:String,
    },
    image: {
        type: String,
    },
    quotation:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ClientOrder",
        }
    ]
});

module.exports = mongoose.model("User", userSchema);
