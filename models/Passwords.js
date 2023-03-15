const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
    password: {
        min: 8,
        type: String,
        required: true
    },
    userId: {
        required: true,
        type: String,
    },
    userEmail: {
        required: true,
        type: String,
    },
}, {timestamps: true});

module.exports = mongoose.model("Password", passwordSchema);