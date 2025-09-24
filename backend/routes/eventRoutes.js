import express from 'express';
import {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  participateInEvent,
  getEventParticipants,
  getMyRegisteredEvents,
  cancelMyRegistration,
} from '../controllers/eventController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// --- Public Routes ---
router.route('/all').get(getAllEvents);
router.route('/:id').get(getSingleEvent);

// --- User Specific Route ---
router.route('/participate/:id').post(isAuthenticatedUser, authorizeRoles('User'), participateInEvent);

// --- Member/Admin Only Routes ---
router.route('/new').post(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), createEvent);

router
  .route('/:id')
  .put(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), updateEvent)
  .delete(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), deleteEvent);

router.route('/participants/:id').get(isAuthenticatedUser, authorizeRoles('Member', 'Secretary', 'President', 'Admin'), getEventParticipants);

router.route('/user/my-events').get(isAuthenticatedUser, authorizeRoles('User'), getMyRegisteredEvents);

router.route('/registration/:eventId/:registrationId').delete(
    isAuthenticatedUser,
    authorizeRoles('User'),
    cancelMyRegistration
);

export default router;
