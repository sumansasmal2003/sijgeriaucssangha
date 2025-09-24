import GalleryImage from '../models/galleryImageModel.js';
import { v2 as cloudinary } from 'cloudinary';

// 1. Upload a new Image to the Gallery (Members/Admin)
export const uploadImage = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!req.files || !req.files.image) {
      return next(new Error('Image file is required', 400));
    }
    if (!title) {
      return next(new Error('Image title is required', 400));
    }

    const file = req.files.image;
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "club_gallery",
    });

    const galleryImage = await GalleryImage.create({
        title,
        image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
        uploadedBy: req.user.id, // ID of the logged-in member
    });

    res.status(201).json({
        success: true,
        message: 'Image uploaded successfully!',
        galleryImage,
    });

  } catch (error) {
    console.error("Upload Image Error:", error);
    next(new Error('Failed to upload image.', 500));
  }
};

// 2. Get All Gallery Images (Public)
export const getAllImages = async (req, res, next) => {
    try {
        const images = await GalleryImage.find()
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'firstName lastName _id'); // <-- Includes _id now

        res.status(200).json({
            success: true,
            images,
        });
    } catch (error) {
        next(new Error('Could not fetch gallery images.', 500));
    }
};

// 3. Delete an Image from the Gallery (Members/Admin)
export const deleteImage = async (req, res, next) => {
    try {
        const image = await GalleryImage.findById(req.params.id);
        if (!image) {
            return next(new Error(`Image not found with id: ${req.params.id}`, 404));
        }

        // Optional: Add a check to ensure only the uploader or an admin can delete
        // if (image.uploadedBy.toString() !== req.user.id && req.user.designation !== 'Admin') {
        //     return next(new Error('Not authorized to delete this image.', 403));
        // }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(image.image.public_id);

        await image.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully.',
        });

    } catch (error) {
        next(new Error('Failed to delete image.', 500));
    }
};
