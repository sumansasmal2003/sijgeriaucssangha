import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
  getAllUsers,
  blockUser,
  unblockUser,
  updateMyProfile,
  updateMyPassword,
  getPublicVolunteers,
  resendVerificationOtp,
} from '../controllers/userController.js';
import { authorizeRoles, isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/verify-email').post(verifyEmail);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser, getMe); // new route
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/all').get(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), getAllUsers);
router.route('/block/:userId').put(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), blockUser);
router.route('/unblock/:userId').put(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), unblockUser);
router.route('/profile/update').put(isAuthenticatedUser, authorizeRoles('User'), updateMyProfile);
router.route('/password/update').put(isAuthenticatedUser, authorizeRoles('User'), updateMyPassword);
router.route('/volunteers').get(getPublicVolunteers);
router.route('/resend-otp').post(resendVerificationOtp);

export default router;
