import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2, Calendar, MapPin, ArrowRight, Clock, Users, Star } from 'lucide-react';
import api from '../api/api';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const EventCard = ({ event, isPast = false }) => {

    const eventDate = new Date(event.date);
    const isToday = format(eventDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
        <motion.div
            variants={fadeIn}
            className={`group relative bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 ${
                isPast
                    ? 'opacity-70 grayscale-[0.3]'
                    : 'hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-2'
            }`}
        >
            {/* Featured Badge */}
            {event.isFeatured && (
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-secondary to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <Star size={12} />
                        <span>Featured</span>
                    </div>
                </div>
            )}

            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.bannerImage.url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-60"></div>

                {/* Date Badge */}
                <div className="absolute top-4 right-4 text-center bg-background/90 backdrop-blur-sm text-text-primary font-bold rounded-xl px-3 py-2 border border-border/50">
                    <span className="block text-sm leading-tight">{format(eventDate, 'MMM')}</span>
                    <span className="block text-xl leading-tight">{format(eventDate, 'dd')}</span>
                </div>

                {/* Today Badge */}
                {isToday && !isPast && (
                    <div className="absolute bottom-4 left-4">
                        <div className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Today
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-3 text-text-secondary text-sm mb-3">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-primary" />
                            <span>{format(eventDate, 'h:mm a')}</span>
                        </div>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                        {event.description}
                    </p>
                </div>

                {/* Event Type & Participants */}
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        event.eventType === 'PARTICIPATION'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-border/50 text-text-secondary'
                    }`}>
                        {event.eventType.toLowerCase()}
                    </span>

                    {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center gap-1 text-text-secondary text-xs">
                            <Users size={12} />
                            <span>{event.participants.length} participating</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {!isPast && event.eventType === 'PARTICIPATION' && (
                    <Link
                        to='/participate'
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        <span>Register to Participate</span>
                    </Link>
                )}

                {isPast && (
                    <div className="text-center text-text-secondary text-sm py-2 border-t border-border/50 mt-4">
                        This event has concluded
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-surface/50 to-background">
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #F8F8F8 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6">
                            Club <span className="text-primary">Events</span>
                        </h1>
                        <p className="text-lg text-text-secondary leading-relaxed mb-8">
                            Stay updated with our upcoming activities and relive our memorable past events.
                            Join us in building a stronger community together.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{upcomingEvents.length}</div>
                                <div className="text-sm text-text-secondary">Upcoming</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-secondary">{pastEvents.length}</div>
                                <div className="text-sm text-text-secondary">Past</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-text-primary">{events.length}</div>
                                <div className="text-sm text-text-secondary">Total</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-4 justify-center mb-12"
                    >
                        {[
                            { key: 'all', label: 'All Events', count: events.length },
                            { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
                            { key: 'past', label: 'Past Events', count: pastEvents.length },
                            { key: 'featured', label: 'Featured', count: featuredEvents.length }
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    activeFilter === filter.key
                                        ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25'
                                        : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50'
                                }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </motion.div>

                    {/* Events Grid */}
                    {filteredEvents.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <Calendar className="w-24 h-24 text-border mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-text-primary mb-2">No events found</h3>
                            <p className="text-text-secondary max-w-md mx-auto">
                                {activeFilter === 'upcoming'
                                    ? "We're planning new events. Check back soon!"
                                    : "No events match your current filter selection."
                                }
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EventsPage;
