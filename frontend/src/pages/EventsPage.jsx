import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format, isToday, isFuture } from 'date-fns';
import { Loader2, Calendar, MapPin, ArrowRight, Clock, Users, Star, Zap, Trophy, Sparkles } from 'lucide-react';
import api from '../api/api';
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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const EventCard = ({ event, isPast = false }) => {
    const eventDate = new Date(event.date);
    const eventIsToday = isToday(eventDate);

    return (
        <motion.div
            variants={fadeIn}
            whileHover={{ y: -5 }}
            className={`group relative bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl overflow-hidden transition-all duration-500 ${
                isPast
                    ? 'opacity-80 grayscale-[0.2] hover:grayscale-0'
                    : 'hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50'
            }`}
        >
            {/* Featured Badge */}
            {event.isFeatured && (
                <motion.div
                    className="absolute top-4 left-4 z-20"
                    whileHover={{ scale: 1.1 }}
                >
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg">
                        <Star size={14} className="fill-current" />
                        <span>FEATURED</span>
                    </div>
                </motion.div>
            )}

            {/* Enhanced Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={event.bannerImage.url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/30 to-transparent"></div>

                {/* Enhanced Date Badge */}
                <motion.div
                    className="absolute top-4 right-4 text-center bg-background/90 backdrop-blur-sm text-text-primary font-black rounded-2xl px-4 py-3 border-2 border-border/50 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    <span className="block text-sm leading-tight uppercase tracking-wider">{format(eventDate, 'MMM')}</span>
                    <span className="block text-2xl leading-tight font-black">{format(eventDate, 'dd')}</span>
                    <span className="block text-xs leading-tight text-text-secondary mt-1">{format(eventDate, 'yyyy')}</span>
                </motion.div>

                {/* Today Badge */}
                {eventIsToday && !isPast && (
                    <motion.div
                        className="absolute bottom-4 left-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-lg">
                            HAPPENING TODAY!
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Enhanced Content Section */}
            <div className="p-6 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}></div>
                </div>

                <div className="relative z-10">
                    <div className="mb-5">
                        <h3 className="text-2xl font-black text-text-primary mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                            {event.title}
                        </h3>

                        <div className="flex items-center gap-4 text-text-secondary text-sm mb-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-400" />
                                <span className="font-semibold">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-cyan-400" />
                                <span className="font-semibold">{format(eventDate, 'h:mm a')}</span>
                            </div>
                        </div>

                        <p className="text-text-secondary text-base leading-relaxed line-clamp-3 font-light">
                            {event.description}
                        </p>
                    </div>

                    {/* Event Type & Participants */}
                    <div className="flex items-center justify-between mb-6">
                        <span className={`text-xs font-black px-3 py-2 rounded-xl uppercase tracking-wider ${
                            event.eventType === 'PARTICIPATION'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                                : 'bg-border/30 text-text-secondary border border-border/50'
                        }`}>
                            {event.eventType.toLowerCase()}
                        </span>

                        {event.participants && event.participants.length > 0 && (
                            <div className="flex items-center gap-2 text-text-secondary text-sm">
                                <Users size={14} className="text-cyan-400" />
                                <span className="font-semibold">{event.participants.length} participating</span>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Action Button */}
                    {!isPast && event.eventType === 'PARTICIPATION' && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                to='/participate'
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black px-6 py-4 rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group"
                            >
                                <Zap size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Register to Participate</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    )}

                    {isPast && (
                        <div className="text-center text-text-secondary text-sm py-3 border-t-2 border-border/30 mt-4 font-semibold">
                            <Trophy className="w-4 h-4 inline-block mr-2 text-amber-400" />
                            This event has concluded successfully
                        </div>
                    )}
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </motion.div>
    );
};

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('upcoming');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/event/all');
                setEvents(data.events);
            } catch (error) {
                toast.error("Failed to load events.");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const today = new Date();
    const upcomingEvents = events.filter(event => new Date(event.date) >= today);
    const pastEvents = events.filter(event => new Date(event.date) < today);
    const featuredEvents = events.filter(event => event.isFeatured);

    const filteredEvents = activeFilter === 'upcoming' ? upcomingEvents :
                          activeFilter === 'past' ? pastEvents :
                          activeFilter === 'featured' ? featuredEvents : events;

    const eventSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": events.map((event, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Event",
                "name": event.title,
                "startDate": new Date(event.date).toISOString(),
                "description": event.description,
                "location": {
                    "@type": "Place",
                    "name": event.location
                },
                "image": event.bannerImage.url,
                "url": `https://sijgeriaucssangha.vercel.app/event/${event._id}`
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
                    <p className="text-text-secondary text-lg font-medium">Loading exciting events...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden">
          <Helmet>
                <title>Events - Sijgeria UCS Sangha</title>
                <meta name="description" content="Stay updated with our upcoming activities and relive our memorable past events." />
                <script type="application/ld+json">
                    {JSON.stringify(eventSchema)}
                </script>
            </Helmet>
            {/* Enhanced Hero Section */}
            <section className="relative py-24 lg:py-32 bg-gradient-to-br from-surface/30 to-background overflow-hidden">
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
                        className="text-center max-w-5xl mx-auto"
                    >
                        {/* Header Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                        >
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm font-black text-cyan-400 uppercase tracking-wider">Events Calendar</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                            Club <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Events</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-3xl mx-auto font-light">
                            Stay updated with our upcoming activities and relive our memorable past events.
                            Join us in building a stronger community together.
                        </p>

                        {/* Enhanced Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
                        >
                            {[
                                { value: upcomingEvents.length, label: 'Upcoming', color: 'from-green-400 to-emerald-400' },
                                { value: pastEvents.length, label: 'Past', color: 'from-cyan-400 to-blue-400' },
                                { value: events.length, label: 'Total', color: 'from-blue-400 to-cyan-400' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-5 rounded-2xl bg-surface/50 border-2 border-border/50 backdrop-blur-sm"
                                >
                                    <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-text-secondary font-bold mt-2 uppercase tracking-wider">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Content Section */}
            <section className="relative py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-4 justify-center mb-16"
                    >
                        {[
                            { key: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length, icon: Zap },
                            { key: 'past', label: 'Past Events', count: pastEvents.length, icon: Trophy },
                            { key: 'featured', label: 'Featured', count: featuredEvents.length, icon: Star },
                            { key: 'all', label: 'All Events', count: events.length, icon: Calendar }
                        ].map((filter) => (
                            <motion.button
                                key={filter.key}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-6 py-4 rounded-2xl font-black transition-all duration-300 relative group flex items-center gap-3 ${
                                    activeFilter === filter.key
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl shadow-blue-500/25'
                                        : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border-2 border-border/50'
                                }`}
                            >
                                <filter.icon size={18} />
                                <span className="relative z-10">
                                    {filter.label} ({filter.count})
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Enhanced Events Grid */}
                    {filteredEvents.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                            {filteredEvents.map(event => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    isPast={new Date(event.date) < today}
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
                                <Calendar className="w-32 h-32 text-border mx-auto mb-6" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-text-primary mb-4">No events found</h3>
                            <p className="text-text-secondary text-lg max-w-md mx-auto mb-8">
                                {activeFilter === 'upcoming'
                                    ? "We're planning amazing new events. Check back soon for updates!"
                                    : "No events match your current filter selection."
                                }
                            </p>
                            <Link
                                to="/gallery"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300"
                            >
                                <Sparkles size={20} />
                                Browse Photo Gallery
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EventsPage;
