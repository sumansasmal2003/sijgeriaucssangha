import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Loader2, Users, Calendar, MapPin, Zap, Target, Sparkles, Trophy } from 'lucide-react';
import Modal from '../../components/Modal';
import { format } from 'date-fns';
import CustomDropdown from '../../components/CustomDropdown';

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


const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const ManageEventsPage = () => {
    const { member } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/event/all');
            const memberEvents = data.events.filter(event => event.createdBy === member._id);
            setEvents(memberEvents);
        } catch (error) {
            toast.error('Could not fetch your events.');
        } finally {
            setLoading(false);
        }
    }, [member._id]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentEvent({ title: '', description: '', date: '', location: '', eventType: 'GENERAL', bannerImage: null });
        setShowModal(true);
    };

    const handleOpenEditModal = (event) => {
        setIsEditing(true);
        const formattedEvent = { ...event, date: new Date(event.date).toISOString().split('T')[0] };
        setCurrentEvent(formattedEvent);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
    };

    const handleSubmit = async (eventData) => {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (key === 'bannerImage' && eventData[key] instanceof File) {
                formData.append(key, eventData[key]);
            } else if (key !== 'bannerImage' && eventData[key] !== null) {
                formData.append(key, eventData[key]);
            }
        });

        try {
            if (isEditing) {
                await api.put(`/event/${currentEvent._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Event updated successfully!');
            } else {
                await api.post('/event/new', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Event created successfully!');
            }
            fetchEvents();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save event.');
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/event/${eventId}`);
                setEvents(events.filter(event => event._id !== eventId));
                toast.success('Event deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete event.');
            }
        }
    };

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
                    <p className="text-text-secondary text-lg">Loading events...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Enhanced background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm font-black text-primary uppercase tracking-wider">Manage Events</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-text-primary">Your Events</h1>
                            <p className="text-text-secondary mt-2 text-lg">Create, edit, and track your club events</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOpenCreateModal}
                            className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                        >
                            <PlusCircle size={20} />
                            <span>Create Event</span>
                        </motion.button>
                    </motion.div>

                    {/* Enhanced Events Grid */}
                    {events.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid gap-6"
                        >
                            {events.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar size={40} className="text-border" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-3">No Events Created Yet</h3>
                            <p className="text-text-secondary mb-6 text-lg">Create your first event to engage with the community.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleOpenCreateModal}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300"
                            >
                                <PlusCircle size={20} />
                                <span>Create Your First Event</span>
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal} title={isEditing ? 'Edit Event' : 'Create New Event'}>
                <EventForm event={currentEvent} onSubmit={handleSubmit} onCancel={handleCloseModal} />
            </Modal>
        </>
    );
};

// Enhanced EventCard Component
const EventCard = ({ event, onEdit, onDelete }) => {
    const isCurrentlyActive = new Date(event.date) >= new Date();

    return (
        <motion.div
            variants={fadeIn}
            className="group relative bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-black text-text-primary mb-2">{event.title}</h3>
                            <p className="text-text-secondary leading-relaxed mb-4">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-text-secondary text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-primary" />
                                    <span className="font-medium">{format(new Date(event.date), 'PP')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" />
                                    <span className="font-medium">{event.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <span className={`px-3 py-1 text-xs font-black rounded-full ${
                                event.eventType === 'PARTICIPATION'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                                {event.eventType}
                            </span>
                            <span className={`px-3 py-1 text-xs font-black rounded-full ${
                                isCurrentlyActive
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                                {isCurrentlyActive ? 'Upcoming' : 'Past'}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-border/30">
                        <div className="flex gap-3">
                            {event.eventType === 'PARTICIPATION' && (
                                <Link
                                    to={`/member/events/participants/${event._id}`}
                                    className="group flex items-center gap-2 text-primary font-black hover:text-primary/80 transition-colors"
                                >
                                    <Users size={18} />
                                    <span>View Participants</span>
                                </Link>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onEdit(event)}
                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                <Edit size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onDelete(event._id)}
                                className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                            >
                                <Trash2 size={18} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Enhanced EventForm Component
const EventForm = ({ event, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(event);
    const [formLoading, setFormLoading] = useState(false);

    const eventTypeOptions = [
        { name: 'General Event', value: 'GENERAL' },
        { name: 'Participation Based', value: 'PARTICIPATION' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, bannerImage: e.target.files[0] }));
    };

    const handleEventTypeChange = (value) => {
        setFormData(prev => ({ ...prev, eventType: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        await onSubmit(formData);
        setFormLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-black text-text-secondary mb-2">Event Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter event title"
                    className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                />
            </div>

            <div>
                <label className="block text-sm font-black text-text-secondary mb-2">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe your event..."
                    className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-vertical"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-black text-text-secondary mb-2">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-black text-text-secondary mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Event location"
                        className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                    />
                </div>
            </div>

            <CustomDropdown
                label="Event Type"
                options={eventTypeOptions}
                selected={formData.eventType}
                setSelected={handleEventTypeChange}
            />

            <div>
                <label className="block text-sm font-black text-text-secondary mb-2">Banner Image</label>
                <input
                    type="file"
                    name="bannerImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-surface/50 border border-border/50 text-text-primary font-black px-6 py-3 rounded-xl hover:border-primary/50 transition-all duration-300"
                >
                    Cancel
                </motion.button>
                <motion.button
                    type="submit"
                    disabled={formLoading}
                    whileHover={{ scale: formLoading ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center gap-3"
                >
                    {formLoading && <Loader2 className="animate-spin" size={18} />}
                    {formLoading ? 'Saving...' : 'Save Event'}
                </motion.button>
            </div>
        </form>
    );
};

export default ManageEventsPage;
