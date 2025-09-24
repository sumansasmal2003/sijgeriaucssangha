import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import errorHandler from './middleware/error.js';
import connectDB from './config/database.js';
import donationRoutes from './routes/donationRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// --- Model Imports ---
import Member from './models/memberModel.js'; // Import Member model for seeding

// --- Route Imports ---
import userRoutes from './routes/userRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

// --- Function to Seed Initial Admin ---
const seedAdmin = async () => {
  try {
    const adminExists = await Member.findOne({ designation: 'Admin' });

    if (!adminExists) {
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        console.log('ADMIN_EMAIL and ADMIN_PASSWORD not found in .env. Skipping admin seed.');
        return;
      }
      await Member.create({
        firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
        lastName: process.env.ADMIN_LAST_NAME || 'User',
        email: process.env.ADMIN_EMAIL,
        contactNumber: process.env.ADMIN_PHONE || '0000000000',
        password: process.env.ADMIN_PASSWORD,
        designation: 'Admin',
        status: 'ACTIVE', // Admin is active by default
      });
      console.log('Admin user seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

// --- Connect to DB, Seed Admin, and Start Server ---
connectDB().then(() => {
    // Seed the admin user after DB connection is successful
    seedAdmin();

    // Start the server only after the DB connection is established
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB. Server not started.', err);
    process.exit(1);
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

// --- API Routes ---
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/member', memberRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1', donationRoutes);
app.use('/api/v1', announcementRoutes);
app.use('/api/v1', volunteerRoutes);
app.use('/api/v1', contactRoutes);

// --- Middleware for Errors ---
app.use(errorHandler);
