import mongoose from 'mongoose';

const performerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
});

const participantSchema = new mongoose.Schema({
    registeredBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    performers: [performerSchema],
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Please enter the event title'] },
    description: { type: String, required: [true, 'Please enter the event description'] },
    date: { type: Date, required: [true, 'Please specify the event date'] },
    location: { type: String, required: [true, 'Please enter the event location'] },
    bannerImage: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    eventType: {
        type: String,
        enum: ['GENERAL', 'PARTICIPATION'],
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Member',
        required: true,
    },
    participants: [participantSchema], // <-- UPDATED SCHEMA
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Event', eventSchema);
