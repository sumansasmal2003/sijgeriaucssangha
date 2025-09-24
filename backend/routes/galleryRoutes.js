import express from 'express';
import {
  uploadImage,
  getAllImages,
  deleteImage,
} from '../controllers/galleryController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// --- Public Route ---
router.route('/all').get(getAllImages);

// --- Member/Admin Only Routes ---
router.route('/upload').post(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), uploadImage);
router.route('/delete/:id').delete(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), deleteImage);

export default router;
