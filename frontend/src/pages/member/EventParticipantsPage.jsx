import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users, ArrowLeft, Mail, Phone, UserCheck, Calendar, MapPin, User, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
};

const EventParticipantsPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchParticipants = useCallback(async () => {
        try {
            setLoading(true);
            // --- FIX: Corrected API URL to plural 'events' ---
            const eventRes = await api.get(`/event/${eventId}`);
            setEvent(eventRes.data.event);

            // --- FIX: Corrected API URL to plural 'events' ---
            const participantsRes = await api.get(`/event/participants/${eventId}`);
            setParticipants(participantsRes.data.participants);
        } catch (error) {
            toast.error("Failed to fetch event participants.");
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    const totalPerformers = participants.reduce((sum, p) => sum + (p.performers ? p.performers.length : 0), 0);
    const eventDate = event ? new Date(event.date) : null;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading participants...</p>
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
                        className="max-w-6xl mx-auto"
                    >
                        <Link to="/member/events" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-all duration-300 group mb-8">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to All Events</span>
                        </Link>

                        <div className="bg-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">Event Participants</h1>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">{event?.title}</h2>
                                    <div className="flex flex-wrap gap-6 text-text-secondary">
                                        {eventDate && (<div className="flex items-center gap-2"><Calendar size={18} className="text-primary" /><span>{format(eventDate, 'MMMM dd, yyyy')}</span></div>)}
                                        {event?.location && (<div className="flex items-center gap-2"><MapPin size={18} className="text-primary" /><span>{event.location}</span></div>)}
                                    </div>
                                </div>
                                <div className="bg-background/50 rounded-xl p-6 border border-border/50">
                                    <div className="grid grid-cols-2 gap-6 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-primary">{participants.length}</div>
                                            <div className="text-sm text-text-secondary">Registrations</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-secondary">{totalPerformers}</div>
                                            <div className="text-sm text-text-secondary">Total Performers</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Participants Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {participants.length > 0 ? (
                        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-6 max-w-4xl mx-auto">
                            {participants.map((registration) => {
                                // --- FIX: Add a check to ensure registeredBy exists ---
                                if (!registration.registeredBy) {
                                    return null; // Skip rendering if the user was deleted or data is missing
                                }
                                return (
                                <motion.div key={registration._id} variants={fadeIn} className="bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 group">
                                    <div className="p-6 bg-gradient-to-r from-background/50 to-surface/30 border-b border-border/50">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        // --- FIX: Use optional chaining for safety ---
                                                        src={registration.registeredBy.profileImage?.url || '/default-avatar.png'}
                                                        alt={registration.registeredBy.fullName}
                                                        className="w-14 h-14 rounded-xl object-cover border-2 border-primary/50"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary text-lg">{registration.registeredBy.fullName}</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary mt-1">
                                                        <a href={`mailto:${registration.email}`} className="flex items-center gap-1.5 hover:text-primary"><Mail size={14}/><span>{registration.email}</span></a>
                                                        <div className="flex items-center gap-1.5"><Phone size={14}/><span>{registration.phone}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                                {registration.performers.length} {registration.performers.length === 1 ? 'Performer' : 'Performers'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-semibold text-text-primary text-lg mb-4 flex items-center gap-2"><Users size={18} className="text-secondary" />Performers Details</h4>
                                        <div className="grid gap-3">
                                            {registration.performers.map((performer, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-background/30 rounded-lg border border-border/30">
                                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary"><User size={16} /></div>
                                                    <div><p className="font-medium text-text-primary">{performer.firstName} {performer.lastName}</p></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )})}
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-6"><Users size={40} className="text-border" /></div>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">No Participants Yet</h3>
                            <p className="text-text-secondary mb-6">No one has registered for this event yet. Check back later.</p>
                            <Link to="/member/events" className="inline-flex items-center gap-2 text-primary hover:underline"><ArrowLeft size={16} /><span>Back to Events</span></Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EventParticipantsPage;
