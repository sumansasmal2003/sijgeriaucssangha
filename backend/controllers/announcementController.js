import Announcement from '../models/announcementModel.js';

// 1. Create a new Announcement (Admin, President, Secretary)
export const createAnnouncement = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const announcement = await Announcement.create({
            title,
            content,
            createdBy: req.user.id,
        });
        res.status(201).json({
            success: true,
            announcement,
        });
    } catch (error) {
        next(new Error('Failed to create announcement.', 500));
    }
};

// 2. Get All Announcements (Public)
export const getAllAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'firstName lastName');

        res.status(200).json({
            success: true,
            announcements,
        });
    } catch (error) {
        next(new Error('Could not fetch announcements.', 500));
    }
};

// 3. Update an Announcement
export const updateAnnouncement = async (req, res, next) => {
    try {
        let announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return next(new Error('Announcement not found.', 404));
        }

        announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            announcement,
        });
    } catch (error) {
        next(new Error('Failed to update announcement.', 500));
    }
};

// 4. Delete an Announcement
export const deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return next(new Error('Announcement not found.', 404));
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully.',
        });
    } catch (error) {
        next(new Error('Failed to delete announcement.', 500));
    }
};
