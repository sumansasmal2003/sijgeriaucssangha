import express from 'express';
import { createDonationRecord } from '../controllers/donationController.js';

const router = express.Router();

router.route('/donation/create').post(createDonationRecord);

export default router;
