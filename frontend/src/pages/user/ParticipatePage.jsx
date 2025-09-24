import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users, ArrowRight, Calendar, Star, Sparkles, Plus, Minus } from 'lucide-react';

const ParticipatePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventId: '',
        phone: user?.contactNumber || '',
        email: user?.email || '',
    });
    const [performers, setPerformers] = useState([{ firstName: '', lastName: '' }]);

    useEffect(() => {
        const fetchParticipationEvents = async () => {
            try {
                const { data } = await api.get('/event/all');
                const upcomingParticipationEvents = data.events.filter(
                    e => e.eventType === 'PARTICIPATION' && new Date(e.date) >= new Date()
                );
                setEvents(upcomingParticipationEvents);
            } catch (error) {
                toast.error("Could not load available events.");
            }
        };
        fetchParticipationEvents();
    }, []);

    const handlePerformerCountChange = (newCount) => {
        const count = Math.max(1, Math.min(10, newCount)); // Min 1, Max 10 performers
        const newPerformers = Array.from({ length: count }, (_, i) => performers[i] || { firstName: '', lastName: '' });
        setPerformers(newPerformers);
    };

    const handlePerformerInfoChange = (index, e) => {
        const newPerformers = [...performers];
        newPerformers[index][e.target.name] = e.target.value;
        setPerformers(newPerformers);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.eventId) {
            return toast.error("Please select an event to participate in.");
        }
        setLoading(true);
        try {
            await api.post(`/event/participate/${formData.eventId}`, {
                phone: formData.phone,
                email: formData.email,
                performers,
            });
            toast.success("Successfully registered your team!");
            navigate('/user/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Left Side - Info Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface to-background relative overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-lg">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg"><Star className="w-8 h-8 text-white" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Event Registration</h1>
                                <p className="text-text-secondary text-sm">Join in on the fun!</p>
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">Take the Stage and <span className="text-primary">Showcase Your Talent</span>.</h2>
                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">This is your opportunity to be a part of our vibrant community events. Fill out the form to register yourself or your team for an unforgettable experience.</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Calendar size={18} /></div><span className="text-sm">Select an upcoming participation event.</span></div>
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Users size={18} /></div><span className="text-sm">Register multiple performers in one go.</span></div>
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Sparkles size={18} /></div><span className="text-sm">Create lasting memories with the community.</span></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Event Participation Form</h2>
                        <p className="text-text-secondary">Fill in the details below to register.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Event and Contact Details */}
                        <div className="space-y-4 p-6 bg-surface/50 border border-border/50 rounded-xl">
                            <h3 className="font-semibold text-text-primary">1. Select Event & Contact Info</h3>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Event</label>
                                <select name="eventId" value={formData.eventId} onChange={handleInputChange} required className="w-full bg-background border border-border rounded-lg p-2.5">
                                    <option value="" disabled>-- Select an Event --</option>
                                    {events.map(event => <option key={event._id} value={event._id}>{event.title}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Your Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Your Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                                </div>
                            </div>
                        </div>

                        {/* Performers Section */}
                        <div className="space-y-4 p-6 bg-surface/50 border border-border/50 rounded-xl">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-text-primary">2. Performer Details</h3>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => handlePerformerCountChange(performers.length - 1)} className="p-1.5 rounded-full bg-secondary/20 text-secondary"><Minus size={16} /></button>
                                    <span className="font-bold text-text-primary w-8 text-center">{performers.length}</span>
                                    <button type="button" onClick={() => handlePerformerCountChange(performers.length + 1)} className="p-1.5 rounded-full bg-primary/20 text-primary"><Plus size={16} /></button>
                                </div>
                            </div>

                            {performers.map((performer, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Performer #{index + 1} First Name</label>
                                        <input type="text" name="firstName" value={performer.firstName} onChange={(e) => handlePerformerInfoChange(index, e)} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                                        <input type="text" name="lastName" value={performer.lastName} onChange={(e) => handlePerformerInfoChange(index, e)} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <motion.button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-4 rounded-xl bg-primary text-white font-semibold disabled:opacity-50">
                            {loading ? <><Loader2 className="animate-spin" /><span>Submitting Registration...</span></> : <><ArrowRight /><span>Register Now</span></>}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ParticipatePage;
