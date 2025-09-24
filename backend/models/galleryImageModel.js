import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the image'],
  },
  album: {
    type: String,
    default: 'General',
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Member',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('GalleryImage', galleryImageSchema);
