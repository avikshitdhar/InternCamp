const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    postingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Posting', // references Posting model
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student', // references Student model
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected', 'TestCompleted'],
        default: 'Applied',
    },
    testLink: {
        type: String,
        trim: true,
    },
    testScore: {
        type: Number,
        min: 0,
        max: 100,
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
