import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Users, Mail, Phone, Edit, Clock, PlusCircle, CheckCircle, XCircle, HelpCircle, LogOut, Sparkles, Trophy, Award, Star, Zap, Target } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

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

// Enhanced Badge Component
const Badge = ({ tier, label, icon: Icon }) => {
    const colors = {
        Bronze: 'from-orange-600 to-orange-700 text-orange-100 shadow-orange-500/25',
        Silver: 'from-gray-500 to-gray-600 text-gray-100 shadow-gray-500/25',
        Gold: 'from-yellow-600 to-yellow-700 text-yellow-100 shadow-yellow-500/25',
        Platinum: 'from-teal-600 to-teal-700 text-teal-100 shadow-teal-500/25',
        Diamond: 'from-cyan-600 to-cyan-700 text-cyan-100 shadow-cyan-500/25',
    };
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${colors[tier]} px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl`}
        >
            {Icon && <Icon size={20} className="filter drop-shadow" />}
            <span className="font-black text-sm tracking-wide">{label}</span>
        </motion.div>
    );
};

// Enhanced Stat Card Component
const StatCard = ({ icon: Icon, value, label, color, delay }) => {
    const colors = {
        primary: 'from-blue-500/20 to-blue-500/10 text-blue-400',
        secondary: 'from-cyan-500/20 to-cyan-500/10 text-cyan-400',
        green: 'from-green-500/20 to-green-500/10 text-green-400',
        yellow: 'from-yellow-500/20 to-yellow-500/10 text-yellow-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative bg-surface/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 hover:border-blue-400/30 transition-all duration-500 shadow-lg hover:shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${colors[color]} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={28}/>
                </div>
                <div>
                    <p className="text-3xl md:text-4xl font-black text-text-primary">{value}</p>
                    <p className="text-sm font-bold text-text-secondary mt-2 tracking-wide">{label}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Enhanced Registration Card Component
const RegistrationCard = ({ registration, onCancel }) => {
    const eventDate = new Date(registration.eventDate);
    const canCancel = isBefore(startOfDay(new Date()), startOfDay(eventDate));

    return (
        <motion.div
            variants={fadeIn}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group relative bg-surface/50 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-blue-400/30 transition-all duration-500 shadow-lg hover:shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-black text-text-primary group-hover:text-blue-400 transition-colors duration-300 mb-3">
                            {registration.eventTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-text-secondary">
                            <Calendar size={20} className="text-blue-400" />
                            <span className="font-medium">{format(eventDate, 'MMMM dd, yyyy')}</span>
                        </div>
                    </div>

                    {canCancel ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onCancel(registration)}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 border border-red-400/20 hover:border-red-400/40 transition-all duration-300"
                        >
                            <XCircle size={20} />
                            <span className="font-bold">Cancel</span>
                        </motion.button>
                    ) : (
                        <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-400 border border-green-400/20">
                            <CheckCircle size={20} />
                            <span className="font-bold">Completed</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-border/30 pt-6">
                    <h4 className="font-black text-text-primary text-lg mb-4 flex items-center gap-3">
                        <Users size={20} className="text-cyan-400" />
                        Registered Performers ({registration.performers.length})
                    </h4>
                    <div className="grid gap-3">
                        {registration.performers.map((performer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-3 bg-background/30 rounded-xl border border-border/20"
                            >
                                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                                <span className="font-medium text-text-primary">
                                    {performer.firstName} {performer.lastName}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Enhanced Main Dashboard Component
const UserDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [regData] = await Promise.all([
                api.get('/event/user/my-events'),
            ]);
            if (regData.data.success) setRegistrations(regData.data.registrations);
        } catch (error) {
            toast.error("Could not fetch your dashboard data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleCancelRegistration = async (registration) => {
        if (window.confirm(`Are you sure you want to cancel your registration for "${registration.eventTitle}"?`)) {
            try {
                await api.delete(`/event/registration/${registration.eventId}/${registration.registrationId}`);
                toast.success("Registration cancelled successfully.");
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to cancel registration.");
            }
        }
    };

    const participationCount = registrations.length;
    const totalPerformers = registrations.reduce((sum, reg) => sum + reg.performers.length, 0);

    let badge = null;
    if (participationCount >= 20) badge = { tier: 'Diamond', label: 'Diamond Volunteer', icon: Sparkles };
    else if (participationCount >= 15) badge = { tier: 'Platinum', label: 'Platinum Volunteer', icon: Award };
    else if (participationCount >= 10) badge = { tier: 'Gold', label: 'Gold Volunteer', icon: Trophy };
    else if (participationCount >= 5) badge = { tier: 'Silver', label: 'Silver Volunteer', icon: Star };
    else if (participationCount >= 1) badge = { tier: 'Bronze', label: 'Bronze Contributor', icon: Star };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <Loader2 className="w-16 h-16 animate-spin text-blue-400 mx-auto mb-6" />
                    <p className="text-text-secondary text-lg font-medium">Loading your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden relative">
            {/* Enhanced Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Enhanced Hero Section */}
            <section className="relative bg-gradient-to-br from-surface/30 to-blue-500/5 pt-20 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-7xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                        >
                            <Zap className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Dashboard</span>
                        </motion.div>

                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                            <div className="flex-1">
                                <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-text-primary mb-6">
                                    Welcome back, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{user.fullName}</span>!
                                </h1>
                                <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
                                    Here's your activity overview and upcoming events. Stay engaged with our vibrant community.
                                </p>
                            </div>
                        </div>

                        {/* Enhanced Stats Grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl"
                        >
                            <StatCard icon={Calendar} value={participationCount} label="Events Registered" color="primary" delay={0.1} />
                            <StatCard icon={Users} value={totalPerformers} label="Performers Registered" color="secondary" delay={0.2} />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Main Content */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Enhanced Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="xl:col-span-1"
                        >
                            <div className="group relative bg-surface/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 space-y-8 xl:sticky xl:top-24 hover:border-blue-400/30 transition-all duration-500 shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    {/* User Badge */}
                                    {badge && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="flex justify-center mb-8"
                                        >
                                            <Badge tier={badge.tier} label={badge.label} icon={badge.icon} />
                                        </motion.div>
                                    )}

                                    {/* Enhanced Profile Section */}
                                    <div className="text-center mb-8">
                                        <div className="relative inline-block mb-6">
                                            <img
                                                src={user.profileImage?.url || '/default-avatar.png'}
                                                alt={user.fullName}
                                                className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-400/50 shadow-2xl"
                                            />
                                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-full shadow-lg">
                                                <CheckCircle size={16} />
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-black text-text-primary">{user.fullName}</h2>
                                    </div>

                                    {/* Enhanced Contact Info */}
                                    <div className="space-y-4 border-t border-border/30 pt-6 mb-8">
                                        <div className="flex items-center gap-4 text-text-secondary p-3 rounded-xl bg-background/30">
                                            <Mail size={20} className="text-blue-400 flex-shrink-0" />
                                            <span className="text-sm font-medium truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-text-secondary p-3 rounded-xl bg-background/30">
                                            <Phone size={20} className="text-cyan-400 flex-shrink-0" />
                                            <span className="text-sm font-medium">{user.phone}</span>
                                        </div>
                                    </div>

                                    {/* Enhanced Action Buttons */}
                                    <div className="space-y-4 border-t border-border/30 pt-6">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Link
                                                to="/user/profile"
                                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 font-black py-4 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300"
                                            >
                                                <Edit size={20} />
                                                <span>Edit Profile</span>
                                            </Link>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-400 font-black py-4 rounded-xl border border-red-400/20 hover:border-red-400/40 transition-all duration-300"
                                            >
                                                <LogOut size={20} />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Enhanced Main Content Area */}
                        <div className="xl:col-span-3 space-y-12">
                            {/* Enhanced Event Registrations Section */}
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-4xl font-black text-text-primary mb-2">Your Event Registrations</h2>
                                        <p className="text-text-secondary">Manage your upcoming events and performances</p>
                                    </div>
                                    <span className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 px-4 py-2 rounded-xl font-black border border-blue-400/20">
                                        {registrations.length} {registrations.length === 1 ? 'Event' : 'Events'}
                                    </span>
                                </div>

                                {registrations.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                        className="grid gap-8"
                                    >
                                        {registrations.map(reg => (
                                            <RegistrationCard
                                                key={reg.registrationId}
                                                registration={reg}
                                                onCancel={handleCancelRegistration}
                                            />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-20 bg-surface/30 border-2 border-dashed border-border/50 rounded-3xl"
                                    >
                                        <Calendar className="w-20 h-20 text-border mx-auto mb-6" />
                                        <h3 className="text-2xl font-black text-text-primary mb-4">No Event Registrations</h3>
                                        <p className="text-text-secondary max-w-md mx-auto text-lg mb-6">
                                            You haven't registered for any events yet. Explore our upcoming events to get involved!
                                        </p>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                to="/events"
                                                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <Target size={20} />
                                                <span>Browse Events</span>
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;
