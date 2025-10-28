const mongoose = require('mongoose');

const postingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company', // or 'Admin' if admins can create postings
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    postingType: {
        type: String,
        enum: ['Internship', 'Placement', 'ITES'],
        default: 'Internship',
    },
    // --- Eligibility Criteria ---
    eligibility: {
        minCgpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
        },
        eligibleDepartments: [{
            type: String,
            trim: true,
            required: true,
        }],
        eligibleYears: [{
            type: Number,
            required: true,
        }]
    },
    location: {
        type: String,
        trim: true,
    },
    deadline: {
        type: Date,
    },
    stipend: {
        type: Number,
    }
}, { timestamps: true });

module.exports = mongoose.model('Posting', postingSchema);


