import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { nanoid } from 'nanoid'; // <-- Import nanoid

const memberSchema = new mongoose.Schema({
    memberId: { // <-- ADD THIS BLOCK
        type: String,
        required: true,
        unique: true,
        default: () => nanoid(10), // Generates a unique 10-character ID
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // Ensure this matches your DB
    designation: {
        type: String,
        enum: ['Member', 'Secretary', 'President', 'Admin'],
        required: true,
    },
    password: { type: String, select: false },
    profileImage: {
        public_id: { type: String },
        url: { type: String },
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE'],
        default: 'PENDING',
    },
    invitationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetTokenExpire: { type: Date, select: false },
    createdAt: { type: Date, default: Date.now },
});

// --- METHODS ---
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

memberSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.designation }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

memberSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

memberSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const Member = mongoose.model('Member', memberSchema);
export default Member;
