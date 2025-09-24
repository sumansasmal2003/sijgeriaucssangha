import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

router.route('/contact/submit').post(submitContactForm);

export default router;
