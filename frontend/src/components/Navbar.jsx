import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Image as ImageIcon, LayoutDashboard, LogIn, LogOut, UserPlus, Menu, X, Megaphone, Users, Heart, Zap, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import sucss from '../assets/sucss.png';

// Animation variants
const menuItemVariants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 }
};

const containerVariants = {
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Announcements', path: '/announcements', icon: Megaphone },
    { name: 'Our Team', path: '/our-team', icon: Users },
];

const Navbar = () => {
    const { isAuthenticated, user, member, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await logout();
            navigate('/');
            setMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLogoutLoading(false);
        }
    };

    const displayName = user?.fullName || (member ? `${member.firstName} ${member.lastName}` : '');
    const dashboardPath = member ? '/member/dashboard' : '/user/dashboard';

    const AuthSection = () => {
        if (loading) {
            return (
                <div className="flex items-center gap-4">
                    <div className="h-9 w-32 bg-surface/50 rounded-xl animate-pulse"></div>
                    <div className="h-9 w-24 bg-surface/50 rounded-xl animate-pulse"></div>
                </div>
            );
        }
        if (isAuthenticated) {
            return (
                <div className="flex items-center gap-4">
                    <Link
                        to={dashboardPath}
                        className="text-sm text-text-secondary hover:text-primary transition-all group flex items-center gap-2"
                    >
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                        Welcome, <span className="font-bold text-text-primary">{displayName}</span>
                    </Link>
                    <motion.button
                        whileHover={{ scale: logoutLoading ? 1 : 1.02 }}
                        whileTap={{ scale: logoutLoading ? 1 : 0.98 }}
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-primary hover:border-primary/50 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {logoutLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span className="font-semibold">Logging out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut size={16} />
                                <span className="font-semibold">Logout</span>
                            </>
                        )}
                    </motion.button>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-primary hover:border-primary/50 group transition-all duration-300">
                        <LogIn size={16} />
                        <span className="font-semibold">Login</span>
                    </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <UserPlus size={16} />
                        <span>Register</span>
                    </Link>
                </motion.div>
            </div>
        );
    };

    const MobileOverlayAuthSection = () => {
        if (isAuthenticated) {
            return (
                <>
                    <motion.div variants={menuItemVariants}>
                        <NavLink
                            to={dashboardPath}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-primary border border-primary/20' : 'text-text-secondary hover:text-primary hover:bg-surface/50'}`}
                        >
                            <LayoutDashboard size={24} />
                            <span>Dashboard</span>
                        </NavLink>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                        <button
                            onClick={handleLogout}
                            disabled={logoutLoading}
                            className="flex items-center gap-4 p-4 rounded-2xl text-lg font-bold text-text-secondary hover:text-primary hover:bg-surface/50 w-full text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {logoutLoading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    <span>Logging out...</span>
                                </>
                            ) : (
                                <>
                                    <LogOut size={24} />
                                    <span>Logout</span>
                                </>
                            )}
                        </button>
                    </motion.div>
                </>
            );
        }
        return (
            <>
                <motion.div variants={menuItemVariants}>
                    <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl text-lg font-bold text-text-secondary hover:text-primary hover:bg-surface/50 transition-all duration-300"
                    >
                        <LogIn size={24} />
                        <span>Login</span>
                    </Link>
                </motion.div>
                <motion.div variants={menuItemVariants}>
                    <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-xl transition-all duration-300"
                    >
                        <UserPlus size={24} />
                        <span>Register</span>
                    </Link>
                </motion.div>
            </>
        );
    };

    return (
        <>
            {/* Enhanced Desktop Navbar */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`sticky top-0 w-full z-50 transition-all duration-500 ${
                    scrolled
                    ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl'
                    : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    <img src={sucss} alt="Club Logo" className="h-10 w-10 rounded-full border-2 border-border relative z-10" />
                                </div>
                                <div>
                                    <span className="text-xl font-black text-text-primary">Sijgeria UCS Sangha</span>
                                    <p className="text-xs text-text-secondary hidden sm:block">Community • Culture • Progress</p>
                                </div>
                            </Link>
                        </motion.div>

                        <nav className="hidden lg:flex items-center gap-8">
                            <div className="flex items-center gap-8">
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) => `relative text-sm font-bold transition-all duration-300 group ${
                                            isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
                                        }`}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full ${
                                            isActive ? 'w-full' : ''
                                        }`}></span>
                                    </NavLink>
                                ))}
                            </div>
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent"></div>
                            <AuthSection />
                        </nav>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-3 rounded-xl border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition-all duration-300"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Enhanced Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-lg"
                    >
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 30 }}
                            className="flex flex-col h-full pt-24 pb-32 px-6"
                        >
                            <motion.nav
                                variants={containerVariants}
                                initial="closed"
                                animate="open"
                                className="flex-1 space-y-3"
                            >
                                {navLinks.map((link) => (
                                    <motion.div key={link.path} variants={menuItemVariants}>
                                        <NavLink
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
                                                isActive
                                                ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-primary border border-primary/20'
                                                : 'text-text-secondary hover:text-primary hover:bg-surface/50'
                                            }`}
                                        >
                                            <link.icon size={24} />
                                            {link.name}
                                        </NavLink>
                                    </motion.div>
                                ))}

                                <div className="pt-6">
                                    <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <MobileOverlayAuthSection />
                                </div>
                            </motion.nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-border/50 p-3 grid grid-cols-5 gap-2 z-40">
                {navLinks.slice(0, 4).map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({isActive}) => `flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-300 group ${
                            isActive
                            ? 'text-primary bg-gradient-to-b from-blue-500/10 to-cyan-500/10 border border-primary/20'
                            : 'text-text-secondary hover:text-primary hover:bg-surface/50'
                        }`}
                    >
                        <link.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-center">{link.name}</span>
                    </NavLink>
                ))}
                {isAuthenticated ? (
                    <NavLink
                        to={dashboardPath}
                        className={({isActive}) => `flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-300 group ${
                            isActive
                            ? 'text-primary bg-gradient-to-b from-blue-500/10 to-cyan-500/10 border border-primary/20'
                            : 'text-text-secondary hover:text-primary hover:bg-surface/50'
                        }`}
                    >
                        <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-center">Dashboard</span>
                    </NavLink>
                ) : (
                    <Link
                        to="/login"
                        className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface/50 transition-all duration-300 group"
                    >
                        <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold text-center">Login</span>
                    </Link>
                )}
            </div>
        </>
    );
};

export default Navbar;
