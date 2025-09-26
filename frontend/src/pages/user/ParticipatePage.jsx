import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users, ArrowRight, Calendar, Star, Sparkles, Plus, Minus, Zap, Target } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const ParticipatePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventId: '',
        phone: user?.phone || '',
        email: user?.email || '',
    });
    const [performers, setPerformers] = useState([{ firstName: '', lastName: '' }]);

    useEffect(() => {
        const fetchParticipationEvents = async () => {
            try {
                const { data } = await api.get('/event/all');
                const upcomingParticipationEvents = data.events.filter(
                    e => e.eventType === 'PARTICIPATION' && new Date(e.date) >= new Date()
                ).map(e => ({ name: e.title, value: e._id }));
                setEvents(upcomingParticipationEvents);
            } catch (error) {
                toast.error("Could not load available events.");
            }
        };
        fetchParticipationEvents();
    }, []);

    const handlePerformerCountChange = (newCount) => {
        const count = Math.max(1, Math.min(10, newCount));
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

    const handleEventChange = (value) => {
        setFormData({ ...formData, eventId: value });
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
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            <div className="min-h-screen flex flex-col lg:flex-row relative z-10">
                {/* Left Side - Enhanced Info Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface/50 to-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-lg"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                            >
                                <Zap className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Event Registration</span>
                            </motion.div>

                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-text-primary mb-6 leading-tight">
                                Take the Stage and <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Showcase Your Talent</span>
                            </h2>

                            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                                This is your opportunity to be a part of our vibrant community events. Fill out the form to register yourself or your team for an unforgettable experience.
                            </p>

                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="space-y-4"
                            >
                                <motion.div variants={fadeIn} className="flex items-center gap-4 text-text-secondary">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-sm font-medium">Select an upcoming participation event</span>
                                </motion.div>
                                <motion.div variants={fadeIn} className="flex items-center gap-4 text-text-secondary">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-cyan-400">
                                        <Users size={20} />
                                    </div>
                                    <span className="text-sm font-medium">Register multiple performers in one go</span>
                                </motion.div>
                                <motion.div variants={fadeIn} className="flex items-center gap-4 text-text-secondary">
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400">
                                        <Sparkles size={20} />
                                    </div>
                                    <span className="text-sm font-medium">Create lasting memories with the community</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Enhanced Form Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-lg"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-4xl font-black tracking-tight text-text-primary mb-2">Event Participation</h2>
                            <p className="text-text-secondary text-lg">Fill in the details below to register</p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Event and Contact Details */}
                            <motion.div
                                variants={fadeIn}
                                className="group relative bg-surface/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-blue-400/30 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-text-primary mb-6 flex items-center gap-3">
                                        <Target className="w-6 h-6 text-blue-400" />
                                        1. Event & Contact Info
                                    </h3>

                                    <CustomDropdown
                                        label="Event"
                                        options={events}
                                        selected={formData.eventId}
                                        setSelected={handleEventChange}
                                        icon={Calendar}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Your Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-background/50 border border-border/50 rounded-xl p-3 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-secondary mb-2">Your Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-background/50 border border-border/50 rounded-xl p-3 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Performers Section */}
                            <motion.div
                                variants={fadeIn}
                                className="group relative bg-surface/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-cyan-400/30 transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                                            <Users className="w-6 h-6 text-cyan-400" />
                                            2. Performer Details
                                        </h3>
                                        <div className="flex items-center gap-2 bg-background/50 rounded-xl p-1">
                                            <button
                                                type="button"
                                                onClick={() => handlePerformerCountChange(performers.length - 1)}
                                                className="p-2 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-300"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-black text-text-primary w-8 text-center">{performers.length}</span>
                                            <button
                                                type="button"
                                                onClick={() => handlePerformerCountChange(performers.length + 1)}
                                                className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {performers.map((performer, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/30 pt-4 mt-4 first:border-t-0 first:pt-0"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Performer #{index + 1} First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={performer.firstName}
                                                    onChange={(e) => handlePerformerInfoChange(index, e)}
                                                    required
                                                    className="w-full bg-background/50 border border-border/50 rounded-xl p-3 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={performer.lastName}
                                                    onChange={(e) => handlePerformerInfoChange(index, e)}
                                                    required
                                                    className="w-full bg-background/50 border border-border/50 rounded-xl p-3 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="group relative w-full flex justify-center items-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-lg shadow-2xl shadow-blue-500/25 hover:shadow-3xl transition-all duration-500 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 flex items-center">
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            <span>Submitting Registration...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                            <span>Register Now</span>
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ParticipatePage;
