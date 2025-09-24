import express from 'express';
import {
    createAnnouncement,
    getAllAnnouncements,
    updateAnnouncement,
    deleteAnnouncement,
} from '../controllers/announcementController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public route to view all announcements
router.route('/announcements/all').get(getAllAnnouncements);

// Protected routes for managing announcements
router.route('/announcements/new').post(
    isAuthenticatedUser,
    authorizeRoles('Admin', 'President', 'Secretary'),
    createAnnouncement
);

router.route('/announcements/:id')
    .put(isAuthenticatedUser, authorizeRoles('Admin', 'President', 'Secretary'), updateAnnouncement)
    .delete(isAuthenticatedUser, authorizeRoles('Admin', 'President', 'Secretary'), deleteAnnouncement);

export default router;
