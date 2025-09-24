import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title for the announcement.'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Please provide content for the announcement.'],
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Member',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Announcement', announcementSchema);
