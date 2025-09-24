import express from 'express';
import { submitVolunteerHours, getMyVolunteerLogs, getAllPendingLogs, updateLogStatus } from '../controllers/volunteerController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.route('/volunteer/log-hours').post(isAuthenticatedUser, authorizeRoles('User'), submitVolunteerHours);
router.route('/volunteer/my-logs').get(isAuthenticatedUser, authorizeRoles('User'), getMyVolunteerLogs);

router.route('/volunteer/pending-logs').get(
    isAuthenticatedUser,
    authorizeRoles('Member', 'Secretary', 'President', 'Admin'),
    getAllPendingLogs
);

router.route('/volunteer/log/:logId').put(
    isAuthenticatedUser,
    authorizeRoles('Member', 'Secretary', 'President', 'Admin'),
    updateLogStatus
);

export default router;
