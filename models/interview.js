const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    testLink: String,
    interviewDate: Date,
    feedback: String,
    result: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);