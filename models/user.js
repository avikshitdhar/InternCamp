const mongoose = require('mongoose');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: uuid.v4,
        unique: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['student', 'company', 'admin'], 
        default: 'student',
    },
    password: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// Hashing the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// checking if (PT => CT) correspondance is correct
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
