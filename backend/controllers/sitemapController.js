import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import Event from '../models/eventModel.js';
import Announcement from '../models/announcementModel.js';
import GalleryImage from '../models/galleryImageModel.js';

export const generateSitemap = async (req, res) => {
    try {
        const links = [];

        // Add static pages
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
        staticPages.forEach(link => links.push(link));

        // Add dynamic event pages
        const events = await Event.find().select('_id updatedAt');
        events.forEach(event => {
            links.push({
                url: `/event/${event._id}`,
                changefreq: 'weekly',
                lastmod: event.updatedAt,
            });
        });

        // Add dynamic announcement pages
        const announcements = await Announcement.find().select('_id updatedAt');
        announcements.forEach(announcement => {
            links.push({
                url: `/announcement/${announcement._id}`,
                changefreq: 'weekly',
                lastmod: announcement.updatedAt,
            });
        });

        const stream = new SitemapStream({ hostname: 'https://sijgeriaucssangha.vercel.app' });

        res.header('Content-Type', 'application/xml');

        const xmlStream = Readable.from(links).pipe(stream);
        const data = await streamToPromise(xmlStream);
        res.send(data.toString());

    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
};
