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
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Animation Variants ---
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

// --- Reusable Dashboard Card Component ---
const DashboardCard = ({ to, icon, title, description, color = 'primary', index }) => {
    const Icon = icon;

    const colorThemes = {
        primary: {
            bg: 'from-blue-500/10 to-cyan-500/10',
            text: 'text-blue-400',
            shadow: 'hover:shadow-blue-500/20',
        },
        secondary: {
            bg: 'from-pink-500/10 to-rose-500/10',
            text: 'text-pink-400',
            shadow: 'hover:shadow-pink-500/20',
        },
        user: {
            bg: 'from-emerald-500/10 to-teal-500/10',
            text: 'text-emerald-400',
            shadow: 'hover:shadow-emerald-500/20',
        }
    };

    const theme = colorThemes[color] || colorThemes.primary;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`group bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 flex flex-col transition-all duration-300 hover:border-border/80 hover:shadow-2xl ${theme.shadow}`}
        >
            <Link to={to} className="flex flex-col h-full">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${theme.bg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className={`w-8 h-8 ${theme.text}`} />
                </div>
                <div className="mt-6 flex-grow">
                    <h3 className="text-2xl font-black text-text-primary">{title}</h3>
                    <p className="mt-2 text-text-secondary text-base leading-relaxed font-light">{description}</p>
                </div>
                <div className={`mt-6 flex items-center text-lg font-bold ${theme.text}`}>
                    <span>Explore Section</span>
                    <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
                </div>
            </Link>
        </motion.div>
    );
};

// --- Main Member Dashboard Component ---
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
        <div className="min-h-screen bg-background">
            {/* Enhanced Header Section */}
            <section className="relative py-24 bg-gradient-to-br from-surface/50 to-background">
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
                    >
                        <div className="flex items-center gap-6">
                            <motion.img
                                src={member?.profileImage?.url}
                                alt={member?.firstName}
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-primary/50 shadow-lg"
                                whileHover={{ scale: 1.1 }}
                            />
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-2">
                                    Welcome back, <span className="text-primary">{member?.firstName}!</span>
                                </h1>
                                <p className="text-lg text-text-secondary max-w-2xl">
                                    Here's your command center for all member activities.
                                </p>
                            </div>
                        </div>
                        <motion.button
                            onClick={handleLogout}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 bg-secondary/10 text-secondary font-semibold px-6 py-3 rounded-xl hover:bg-secondary/20 transition-all duration-300"
                        >
                            <LogOut size={20}/>
                            <span>Logout</span>
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Dashboard Grid Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemberDashboard;
