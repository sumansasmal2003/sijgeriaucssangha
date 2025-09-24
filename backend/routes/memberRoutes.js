import express from 'express';
import {
  completeMemberProfile,
    deleteMember,
    forgotPassword,
    getAllMembers,
    getSingleMember,
    inviteMember,
    loginMember,
    logoutMember, // import
    getMe, // import
    resetPassword,
    updateMemberDetails,
    updateMyProfile,
    updateMyPassword,
    getMemberDirectory,
    getPublicDirectory,
} from '../controllers/memberController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// --- Member Auth Routes ---
router.route('/login').post(loginMember);
router.route('/logout').get(logoutMember); // new route
router.route('/me').get(isAuthenticatedUser, getMe); // new route
router.route('/profile/complete/:token').put(completeMemberProfile);
router.route('/profile/update').put(isAuthenticatedUser, updateMyProfile);
router.route('/password/update').put(isAuthenticatedUser, updateMyPassword);

// --- NEW PASSWORD ROUTES ---
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

// --- Admin Only Routes ---
router.route('/invite').post(isAuthenticatedUser, authorizeRoles('Admin'), inviteMember);
router.route('/admin/all').get(isAuthenticatedUser, authorizeRoles('Admin'), getAllMembers);
router.route('/admin/:id')
    .get(isAuthenticatedUser, authorizeRoles('Admin'), getSingleMember)
    .put(isAuthenticatedUser, authorizeRoles('Admin'), updateMemberDetails)
    .delete(isAuthenticatedUser, authorizeRoles('Admin'), deleteMember);
router.route('/directory').get(
    isAuthenticatedUser,
    authorizeRoles('Member', 'Secretary', 'President', 'Admin'),
    getMemberDirectory
);
router.route('/public-directory').get(getPublicDirectory);

export default router;
