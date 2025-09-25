import express from 'express';
import { generateSitemap } from '../controllers/sitemapController.js';

const router = express.Router();

router.route('/sitemap.xml').get(generateSitemap);

export default router;
