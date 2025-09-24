import mongoose from 'mongoose';

const volunteerLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true,
    },
    hours: {
        type: Number,
        required: [true, 'Please enter the number of hours you volunteered.'],
        min: [0.5, 'Minimum of 0.5 hours required.'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a brief description of your task.'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    loggedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('VolunteerLog', volunteerLogSchema);
