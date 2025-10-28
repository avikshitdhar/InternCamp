const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    collegeId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    program: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    graduation_year: { type: Number, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    resume_url: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
