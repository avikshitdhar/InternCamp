const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    totalStudents: Number,
    totalCompanies: Number,
    totalPostings: Number,
    totalApplications: Number,
    shortlistedCount: Number,
    placedCount: Number,
    topDepartments: [String],
}, { timestamps: true });

module.exports = mongoose.model('Statistics', statisticsSchema);
