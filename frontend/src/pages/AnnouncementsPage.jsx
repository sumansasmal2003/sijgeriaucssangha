import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Megaphone, Calendar, User, Bell, Zap, Clock, Eye, Star } from 'lucide-react';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { Helmet } from 'react-helmet-async';

// Enhanced Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/announcements/all');
                setAnnouncements(data.announcements);
            } catch (error) {
                toast.error("Failed to load announcements.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const getTimeCategory = (date) => {
        const announcementDate = new Date(date);
        if (isToday(announcementDate)) return 'today';
        if (isThisWeek(announcementDate)) return 'week';
        if (isThisMonth(announcementDate)) return 'month';
        return 'older';
    };

    const filteredAnnouncements = filter === 'all'
        ? announcements
        : announcements.filter(ann => getTimeCategory(ann.createdAt) === filter);

    const timeCategories = [
        { key: 'all', label: 'All Announcements', count: announcements.length, icon: Bell },
        { key: 'today', label: 'Today', count: announcements.filter(ann => isToday(new Date(ann.createdAt))).length, icon: Zap },
        { key: 'week', label: 'This Week', count: announcements.filter(ann => isThisWeek(new Date(ann.createdAt))).length, icon: Clock },
        { key: 'month', label: 'This Month', count: announcements.filter(ann => isThisMonth(new Date(ann.createdAt))).length, icon: Calendar }
    ];

    const announcementSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": announcements.map((announcement, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Article",
                "headline": announcement.title,
                "articleBody": announcement.content,
                "author": {
                    "@type": "Person",
                    "name": `${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`
                },
                "datePublished": new Date(announcement.createdAt).toISOString(),
                "url": `https://sijgeriaucssangha.vercel.app/announcement/${announcement._id}`
            }
        }))
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-text-secondary text-lg font-medium">Loading announcements...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden">
          <Helmet>
                <title>Announcements - Sijgeria UCS Sangha</title>
                <meta name="description" content="Stay updated with the latest news, important updates, and exciting announcements from our community." />
                <script type="application/ld+json">
                    {JSON.stringify(announcementSchema)}
                </script>
            </Helmet>
            {/* Enhanced Hero Section */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-surface/30 to-background">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Header Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                        >
                            <Megaphone className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm font-black text-cyan-400 uppercase tracking-wider">Notice Board</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                            Club <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Announcements</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-light">
                            Stay updated with the latest news, important updates, and exciting announcements
                            from our community. Never miss an important update again.
                        </p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-4 gap-6 max-w-2xl mx-auto mt-12"
                        >
                            {timeCategories.map((category) => (
                                <motion.div
                                    key={category.key}
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-4 rounded-2xl bg-surface/50 border-2 border-border/50 backdrop-blur-sm"
                                >
                                    <category.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                                    <div className="text-2xl font-black text-text-primary">{category.count}</div>
                                    <div className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">{category.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Content Section */}
            <section className="relative py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-4 justify-center mb-12"
                    >
                        {timeCategories.map((category) => (
                            <motion.button
                                key={category.key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter(category.key)}
                                className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 relative group flex items-center gap-3 ${
                                    filter === category.key
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl shadow-blue-500/25'
                                        : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border-2 border-border/50'
                                }`}
                            >
                                <category.icon size={18} />
                                <span className="relative z-10">
                                    {category.label} ({category.count})
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Announcements Grid */}
                    {filteredAnnouncements.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
                        >
                            {filteredAnnouncements.map((announcement, index) => (
                                <AnnouncementCard
                                    key={announcement._id}
                                    announcement={announcement}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Megaphone className="w-32 h-32 text-border mx-auto mb-6" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-text-primary mb-4">No announcements found</h3>
                            <p className="text-text-secondary text-lg max-w-md mx-auto">
                                {filter === 'all'
                                    ? "Check back soon for exciting updates and announcements!"
                                    : `No announcements found for this time period.`
                                }
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

const AnnouncementCard = ({ announcement, index }) => {
    const announcementDate = new Date(announcement.createdAt);
    const isNew = isToday(announcementDate);

    return (
        <motion.div
            variants={scaleIn}
            custom={index}
            className="group relative bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2"
        >
            {/* New Badge */}
            {isNew && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className="absolute top-4 right-4"
                >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-lg">
                        NEW
                    </div>
                </motion.div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-black text-text-primary mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-500">
                        {announcement.title}
                    </h3>
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-cyan-400" />
                            <span className="font-semibold">{announcement.createdBy.firstName} {announcement.createdBy.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-400" />
                            <span className="font-semibold">{format(announcementDate, 'PP')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <p className="text-text-primary leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t-2 border-border/30">
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Eye size={14} />
                    <span>Posted {format(announcementDate, 'PP')}</span>
                </div>
                <div className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
                    {getTimeAgo(announcementDate)}
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </motion.div>
    );
};

// Helper function to get time ago
const getTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
};

export default AnnouncementsPage;
