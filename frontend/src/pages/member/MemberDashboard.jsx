import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CalendarPlus, ImagePlus, UserCog, Users, ArrowRight, UserPlus, BookOpen, Megaphone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Reusable Dashboard Card Component (with new color props) ---
const DashboardCard = ({ to, icon, title, description, color = 'primary' }) => {
    const Icon = icon;

    // Define color themes based on props
    const colorThemes = {
        primary: {
            bg: 'bg-primary/10',
            text: 'text-primary',
            shadow: 'hover:shadow-primary/20',
        },
        secondary: {
            bg: 'bg-secondary/10',
            text: 'text-secondary',
            shadow: 'hover:shadow-secondary/20',
        },
        user: {
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            shadow: 'hover:shadow-blue-500/20',
        }
    };

    const theme = colorThemes[color] || colorThemes.primary;

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` }}
            className={`bg-surface border border-border rounded-xl p-6 group transition-all duration-300 hover:border-border/50 hover:shadow-2xl ${theme.shadow}`}
        >
            <Link to={to} className="flex flex-col h-full">
                <div className="flex-shrink-0">
                    <div className={`${theme.bg} ${theme.text} w-12 h-12 flex items-center justify-center rounded-lg transition-colors duration-300 group-hover:bg-opacity-20`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <div className="mt-4 flex-grow">
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    <p className="mt-1 text-text-secondary text-sm">{description}</p>
                </div>
                <div className={`mt-4 flex items-center text-sm font-semibold ${theme.text}`}>
                    <span>Go to section</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
            </Link>
        </motion.div>
    );
};

// --- Main Member Dashboard Component ---
const MemberDashboard = () => {
    const { member } = useAuth();

    const canInvite = ['Admin', 'President', 'Secretary'].includes(member?.designation);
    const canManageAnnouncements = ['Admin', 'President', 'Secretary'].includes(member?.designation);

    // Define dashboard items with their specific colors
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
            >
                <div className="relative inline-block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-20"></div>
                    <h1 className="relative text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
                        Welcome back, {member?.firstName}!
                    </h1>
                </div>
                <p className="mt-4 text-lg text-text-secondary max-w-2xl">
                    Manage club activities, connect with members, and access your tools from this central hub.
                </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dashboardItems.map((item, index) => (
                    <DashboardCard
                        key={index}
                        to={item.to}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default MemberDashboard;
