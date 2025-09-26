import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users, ArrowLeft, Mail, Phone, UserCheck, Calendar, MapPin, User, Sparkles, Trophy, Zap, Target } from 'lucide-react';
import { format } from 'date-fns';

// Animation variants matching homepage
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
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const EventParticipantsPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchParticipants = useCallback(async () => {
        try {
            setLoading(true);
            const eventRes = await api.get(`/event/${eventId}`);
            setEvent(eventRes.data.event);

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
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary text-lg">Loading participants...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative py-20 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-6xl mx-auto"
                    >
                        <Link to="/member/events" className="group inline-flex items-center gap-3 text-text-secondary hover:text-primary transition-all duration-300 mb-8 relative z-10">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to All Events</span>
                        </Link>

                        <motion.div
                            variants={scaleIn}
                            initial="initial"
                            animate="animate"
                            className="bg-surface/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-black text-primary uppercase tracking-wider">Event Participants</span>
                                        </div>
                                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-4">{event?.title}</h1>
                                        <div className="flex flex-wrap gap-6 text-text-secondary text-lg">
                                            {eventDate && (
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={20} className="text-primary" />
                                                    <span className="font-medium">{format(eventDate, 'MMMM dd, yyyy')}</span>
                                                </div>
                                            )}
                                            {event?.location && (
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={20} className="text-primary" />
                                                    <span className="font-medium">{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
                                    >
                                        <div className="grid grid-cols-2 gap-8 text-center">
                                            <div>
                                                <div className="text-3xl font-black text-primary">{participants.length}</div>
                                                <div className="text-sm text-text-secondary font-medium">Registrations</div>
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black text-secondary">{totalPerformers}</div>
                                                <div className="text-sm text-text-secondary font-medium">Total Performers</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Participants Section */}
            <section className="relative py-16 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {participants.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid gap-6 max-w-4xl mx-auto"
                        >
                            {participants.map((registration) => {
                                if (!registration.registeredBy) return null;

                                return (
                                    <motion.div
                                        key={registration._id}
                                        variants={fadeIn}
                                        className="group relative bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative z-10">
                                            <div className="p-6 bg-gradient-to-r from-background/50 to-surface/30 border-b border-border/50">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <img
                                                                src={registration.registeredBy.profileImage?.url || '/default-avatar.png'}
                                                                alt={registration.registeredBy.fullName}
                                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/50 shadow-lg"
                                                            />
                                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                                <UserCheck size={12} className="text-white" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-text-primary text-xl">{registration.registeredBy.fullName}</p>
                                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-text-secondary mt-2">
                                                                <a href={`mailto:${registration.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                                                    <Mail size={16}/>
                                                                    <span className="font-medium">{registration.email}</span>
                                                                </a>
                                                                <div className="flex items-center gap-2">
                                                                    <Phone size={16}/>
                                                                    <span className="font-medium">{registration.phone}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
                                                        {registration.performers.length} {registration.performers.length === 1 ? 'Performer' : 'Performers'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-black text-text-primary text-lg mb-4 flex items-center gap-3">
                                                    <Trophy className="text-secondary" size={20} />
                                                    Performers Details
                                                </h4>
                                                <div className="grid gap-4">
                                                    {registration.performers.map((performer, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-border/30 hover:border-secondary/50 transition-all duration-300"
                                                        >
                                                            <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
                                                                <User size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-text-primary">{performer.firstName} {performer.lastName}</p>
                                                                {performer.age && (
                                                                    <p className="text-text-secondary text-sm font-medium">Age: {performer.age}</p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 max-w-md mx-auto"
                        >
                            <div className="w-24 h-24 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={40} className="text-border" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-3">No Participants Yet</h3>
                            <p className="text-text-secondary mb-6 text-lg">No one has registered for this event yet. Check back later.</p>
                            <Link
                                to="/member/events"
                                className="group inline-flex items-center gap-3 text-primary font-black hover:underline"
                            >
                                <ArrowLeft size={16} />
                                <span>Back to Events</span>
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EventParticipantsPage;
