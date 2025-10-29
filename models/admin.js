const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    logo: {
        type: String,          // URL or base64 string
        trim: true,
        default: ''            // Optional default empty
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
