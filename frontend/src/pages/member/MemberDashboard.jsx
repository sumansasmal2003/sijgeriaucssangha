import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    CalendarPlus,
    ImagePlus,
    UserCog,
    Users,
    ArrowRight,
    UserPlus,
    BookOpen,
    Megaphone,
    LogOut,
    Sparkles,
    Zap,
    Target,
    Trophy,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

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

// Enhanced Dashboard Card Component
const DashboardCard = ({ to, icon, title, description, color = 'primary', index }) => {
    const Icon = icon;

    const colorThemes = {
        primary: {
            bg: 'from-primary/10 to-primary/5',
            border: 'border-primary/30',
            text: 'text-primary',
            iconBg: 'bg-primary/10',
            gradient: 'from-primary to-primary-hover'
        },
        secondary: {
            bg: 'from-secondary/10 to-secondary/5',
            border: 'border-secondary/30',
            text: 'text-secondary',
            iconBg: 'bg-secondary/10',
            gradient: 'from-secondary to-pink-500'
        },
        user: {
            bg: 'from-green-500/10 to-green-500/5',
            border: 'border-green-500/30',
            text: 'text-green-500',
            iconBg: 'bg-green-500/10',
            gradient: 'from-green-500 to-teal-500'
        }
    };

    const theme = colorThemes[color] || colorThemes.primary;

    return (
        <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            custom={index}
            className="group relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Link to={to} className="relative z-10 block h-full">
                <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative bg-surface/80 backdrop-blur-sm border-2 ${theme.border} rounded-3xl p-8 flex flex-col h-full transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10 overflow-hidden`}
                >
                    {/* Animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className="relative z-10">
                        <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${theme.iconBg} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 mb-6`}>
                            <Icon className={`w-8 h-8 ${theme.text}`} />
                        </div>

                        <div className="flex-grow">
                            <h3 className="text-2xl font-black text-text-primary mb-3">{title}</h3>
                            <p className="text-text-secondary text-base leading-relaxed font-medium">{description}</p>
                        </div>

                        <div className={`mt-6 flex items-center text-lg font-black ${theme.text} group-hover:translate-x-2 transition-transform duration-300`}>
                            <span>Explore Section</span>
                            <ArrowRight className="w-5 h-5 ml-3" />
                        </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </motion.div>
            </Link>
        </motion.div>
    );
};

// Main Enhanced Member Dashboard Component
const MemberDashboard = () => {
    const { member, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const canInvite = ['Admin', 'President', 'Secretary'].includes(member?.designation);
    const canManageAnnouncements = ['Admin', 'President', 'Secretary'].includes(member?.designation);

    const dashboardItems = [
        { to: "/member/events", icon: CalendarPlus, title: "Manage Events", description: "Create, update, and view participants for all club events.", color: "primary" },
        { to: "/member/gallery", icon: ImagePlus, title: "Manage Gallery", description: "Upload new photos from recent events to the public gallery.", color: "secondary" },
        { to: "/member/profile", icon: UserCog, title: "Profile Settings", description: "Update your personal information and change your password.", color: "user" },
        { to: "/member/users", icon: Users, title: "Manage Users", description: "View all registered users and manage their account status.", color: "secondary" },
        { to: "/member/directory", icon: BookOpen, title: "Member Directory", description: "View the list of all active club members and their roles.", color: "primary" },
    ];

    if (canManageAnnouncements) {
        dashboardItems.push({ to: "/member/announcements", icon: Megaphone, title: "Manage Announcements", description: "Post, edit, and delete official club announcements.", color: "user" });
    }
    if (canInvite) {
        dashboardItems.push({ to: "/member/invite", icon: UserPlus, title: "Invite Member", description: "Send an invitation to a new member to join the club.", color: "primary" });
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

            {/* Enhanced Header Section */}
            <section className="relative py-20 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                            <motion.div
                                variants={fadeIn}
                                className="flex flex-col justify-center md:flex-row items-center gap-6"
                            >
                                <div className="relative">
                                    <motion.img
                                        src={member?.profileImage?.url}
                                        alt={member?.firstName}
                                        className="w-24 h-24 rounded-2xl object-cover border-4 border-primary/50 shadow-2xl"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-surface">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <motion.div
                                        variants={scaleIn}
                                        className="inline-flex items-center gap-3 mb-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                                    >
                                        <Trophy className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-black text-primary uppercase tracking-wider">{member?.designation}</span>
                                    </motion.div>
                                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-2">
                                        Welcome back, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{member?.firstName}!</span>
                                    </h1>
                                    <p className="text-lg text-text-secondary max-w-2xl font-medium">
                                        Here's your command center for all member activities and community management.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.button
                                variants={fadeIn}
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 bg-surface/80 backdrop-blur-sm border border-border/50 text-text-primary font-black px-6 py-3 rounded-xl hover:border-primary/50 transition-all duration-300"
                            >
                                <LogOut size={20}/>
                                <span>Logout</span>
                            </motion.button>
                        </div>

                        <motion.div
                            variants={fadeIn}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {dashboardItems.map((item, index) => (
                                <DashboardCard
                                    key={index}
                                    to={item.to}
                                    icon={item.icon}
                                    title={item.title}
                                    description={item.description}
                                    color={item.color}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default MemberDashboard;
