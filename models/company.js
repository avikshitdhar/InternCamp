const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {       // optional, if companies have login
        type: String,
        required: true
    },
    logo: {           // URL to company logo
        type: String,
        trim: true,
        default: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
