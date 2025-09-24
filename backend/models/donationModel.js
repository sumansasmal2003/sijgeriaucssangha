import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
    },
    amount: {
        type: Number,
        required: [true, 'Please enter a donation amount.'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Donation', donationSchema);
