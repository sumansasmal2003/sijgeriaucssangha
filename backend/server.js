import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import errorHandler from './middleware/error.js';
import connectDB from './config/database.js';

// --- Sitemap Imports ---
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import Event from './models/eventModel.js';
import Announcement from './models/announcementModel.js';

// --- Route Imports ---
import userRoutes from './routes/userRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// --- Correct Middleware Order & Manual CORS ---

// 1. Manually set CORS headers for all responses
const allowedOrigins = ['http://localhost:5173', 'https://sucss.netlify.app', 'https://sucss.vercel.app'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle pre-flight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

// 2. Body Parsers and Cookie Parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 3. File Upload
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));


// --- Cloudinary Config ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Sitemap Route ---
app.get('/sitemap.xml', async (req, res) => {
    try {
        const links = [];
        const staticPages = [
            { url: '/', changefreq: 'daily', priority: 1.0 },
            { url: '/events', changefreq: 'weekly', priority: 0.8 },
            { url: '/gallery', changefreq: 'weekly', priority: 0.8 },
            { url: '/announcements', changefreq: 'weekly', priority: 0.8 },
            { url: '/our-team', changefreq: 'monthly', priority: 0.7 },
            { url: '/about', changefreq: 'monthly', priority: 0.7 },
            { url: '/contact', changefreq: 'monthly', priority: 0.5 },
            { url: '/donate', changefreq: 'monthly', priority: 0.6 },
            { url: '/login', changefreq: 'monthly', priority: 0.4 },
            { url: '/register', changefreq: 'monthly', priority: 0.4 },
            { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
            { url: '/terms', changefreq: 'yearly', priority: 0.3 },
        ];
        links.push(...staticPages);

        const events = await Event.find().select('_id updatedAt');
        events.forEach(event => links.push({ url: `/event/${event._id}`, changefreq: 'weekly', lastmod: event.updatedAt }));

        const announcements = await Announcement.find().select('_id updatedAt');
        announcements.forEach(announcement => links.push({ url: `/announcement/${announcement._id}`, changefreq: 'weekly', lastmod: announcement.updatedAt }));

        const stream = new SitemapStream({ hostname: 'https://sucss.vercel.app' });
        res.header('Content-Type', 'application/xml');
        const xmlStream = Readable.from(links).pipe(stream);
        const data = await streamToPromise(xmlStream);
        res.send(data.toString());
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

// --- API Routes ---
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/member', memberRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1', donationRoutes);
app.use('/api/v1', announcementRoutes);
app.use('/api/v1', contactRoutes);

// --- Error Middleware (should be last) ---
app.use(errorHandler);

// --- Database Connection and Server Start ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB. Server not started.', err);
    process.exit(1);
});
