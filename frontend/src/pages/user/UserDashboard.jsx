import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Users, Mail, Phone, Edit, Clock, PlusCircle, CheckCircle, XCircle, HelpCircle, LogOut, Sparkles, Trophy, Award, Star } from 'lucide-react';
import { format, isBefore, startOfDay } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// --- Reusable Badge Component ---
const Badge = ({ tier, label, icon: Icon }) => {
    const colors = {
        Bronze: 'from-orange-600 to-orange-700 text-orange-100',
        Silver: 'from-gray-500 to-gray-600 text-gray-100',
        Gold: 'from-yellow-600 to-yellow-700 text-yellow-100',
        Platinum: 'from-teal-600 to-teal-700 text-teal-100',
        Diamond: 'from-cyan-600 to-cyan-700 text-cyan-100',
    };
    return (
        <div className={`bg-gradient-to-r ${colors[tier]} px-4 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
            {Icon && <Icon size={16} />}
            <span className="font-bold text-sm">{label}</span>
        </div>
    );
};

// --- Reusable Stat Card Component ---
const StatCard = ({ icon: Icon, value, label, color, delay }) => {
    const colors = {
        primary: 'from-primary/20 to-primary/10 text-primary',
        secondary: 'from-secondary/20 to-secondary/10 text-secondary',
        green: 'from-green-500/20 to-green-500/10 text-green-400',
        yellow: 'from-yellow-500/20 to-yellow-500/10 text-yellow-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="group relative bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24}/>
                </div>
                <div>
                    <p className="text-2xl md:text-3xl font-bold text-text-primary">{value}</p>
                    <p className="text-sm font-medium text-text-secondary mt-1">{label}</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- Registration Card Component ---
const RegistrationCard = ({ registration, onCancel }) => {
    const eventDate = new Date(registration.eventDate);
    const canCancel = isBefore(startOfDay(new Date()), startOfDay(eventDate));

    return (
        <motion.div
            variants={fadeIn}
            className="group bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
        >
            <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                            {registration.eventTitle}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-text-secondary">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-sm">{format(eventDate, 'MMMM dd, yyyy')}</span>
                        </div>
                    </div>

                    {canCancel ? (
                        <button
                            onClick={() => onCancel(registration)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all duration-300"
                        >
                            <XCircle size={16} />
                            <span className="text-sm font-medium">Cancel</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Completed</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-border/50 pt-4">
                    <h4 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
                        <Users size={16} className="text-secondary" />
                        Registered Performers ({registration.performers.length})
                    </h4>
                    <div className="grid gap-2">
                        {registration.performers.map((performer, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-background/30 rounded-lg">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-sm text-text-primary">
                                    {performer.firstName} {performer.lastName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Dashboard Component ---
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-surface/50 to-background">
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
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                            <div className="flex-1">
                                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-4">
                                    Welcome back, <span className="text-primary">{user.fullName}</span>!
                                </h1>
                                <p className="text-lg text-text-secondary max-w-2xl">
                                    Here's your activity overview and upcoming events. Stay engaged with our community.
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
                        >
                            <StatCard icon={Calendar} value={participationCount} label="Events Registered" color="primary" delay={0.1} />
                            <StatCard icon={Users} value={totalPerformers} label="Performers Registered" color="secondary" delay={0.2} />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - User Profile */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 space-y-6 lg:sticky lg:top-24">
                                {/* User Badge */}
                                {badge && (
                                    <div className="flex justify-center">
                                        <Badge tier={badge.tier} label={badge.label} icon={badge.icon} />
                                    </div>
                                )}

                                {/* Profile Image */}
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <img
                                            src={user.profileImage?.url || '/default-avatar.png'}
                                            alt={user.fullName}
                                            className="w-24 h-24 rounded-2xl object-cover border-4 border-primary/50 shadow-lg"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full">
                                            <CheckCircle size={16} />
                                        </div>
                                    </div>
                                    <h2 className="mt-4 text-xl font-bold text-text-primary">{user.fullName}</h2>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 border-t border-border/50 pt-4">
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <Mail size={16} className="text-primary flex-shrink-0" />
                                        <span className="text-sm truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <Phone size={16} className="text-primary flex-shrink-0" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 border-t border-border/50 pt-4">
                                    <Link
                                        to="/user/profile"
                                        className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary font-semibold py-3 rounded-xl hover:bg-primary/20 transition-all duration-300"
                                    >
                                        <Edit size={16} />
                                        <span>Edit Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-secondary/10 text-secondary font-semibold py-3 rounded-xl hover:bg-secondary/20 transition-all duration-300"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3 space-y-12">
                            {/* Event Registrations Section */}
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Your Event Registrations</h2>
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                        {registrations.length} {registrations.length === 1 ? 'Event' : 'Events'}
                                    </span>
                                </div>

                                {registrations.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                        className="grid gap-6"
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
                                        className="text-center py-16 bg-surface/30 border-2 border-dashed border-border/50 rounded-2xl"
                                    >
                                        <Calendar className="w-16 h-16 text-border mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-text-primary mb-2">No Event Registrations</h3>
                                        <p className="text-text-secondary max-w-md mx-auto">
                                            You haven't registered for any events yet. Explore our upcoming events to get involved!
                                        </p>
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
