import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Users, Mail, Phone, Crown, Award, Star, Zap, Sparkles } from 'lucide-react';

// Enhanced Animation Variants
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const OfficialCard = ({ member, index }) => {
    return (
        <motion.div
            variants={scaleIn}
            custom={index}
            className="group relative bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 text-center flex flex-col items-center hover:shadow-2xl hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-3"
        >
            {/* Profile Image */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                    src={member.profileImage.url}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-border relative z-10 group-hover:border-blue-400/50 transition-all duration-300"
                />
                {/* Role Badge */}
                <div className="transform">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-lg">
                        {member.designation}
                    </div>
                </div>
            </div>

            {/* Member Info */}
            <h3 className="text-2xl font-black text-text-primary mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                {member.firstName} {member.lastName}
            </h3>

            {/* Contact Info */}
            <div className="mt-4 space-y-3 w-full">
                <a
                    href={`mailto:${member.email}`}
                    className="flex items-center justify-center gap-3 text-text-secondary hover:text-blue-400 transition-colors duration-300 group/contact"
                >
                    <Mail size={16} className="text-blue-400 group-hover/contact:scale-110 transition-transform" />
                    <span className="font-medium">{member.email}</span>
                </a>
                <div className="flex items-center justify-center gap-3 text-text-secondary">
                    <Phone size={16} className="text-cyan-400" />
                    <span className="font-medium">{member.phone}</span>
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </motion.div>
    );
};

const OurTeamPage = () => {
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficials = async () => {
            try {
                const { data } = await api.get('/member/public-directory');
                setOfficials(data.officials);
            } catch (error) {
                toast.error('Could not fetch team directory.');
            } finally {
                setLoading(false);
            }
        };
        fetchOfficials();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-text-secondary text-lg font-medium">Loading our leadership team...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Enhanced Hero Section */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-surface/30 to-background">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Header Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                        >
                            <Crown className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-black text-blue-400 uppercase tracking-wider">Leadership Team</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                            Meet Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Leadership</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-light">
                            The dedicated individuals who guide our club's vision and drive our community forward.
                            Get to know the passionate leaders behind our success.
                        </p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-12"
                        >
                            {[
                                { value: officials.length, label: 'Team Members', color: 'blue' },
                                { value: '10+', label: 'Years Experience', color: 'cyan' },
                                { value: '50+', label: 'Events Led', color: 'blue' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-4 rounded-2xl bg-surface/50 border-2 border-border/50 backdrop-blur-sm"
                                >
                                    <div className={`text-3xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color === 'blue' ? 'cyan' : 'blue'}-400 bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-text-secondary font-bold mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Content Section */}
            <section className="relative py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {officials.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                        >
                            {officials.map((member, index) => (
                                <OfficialCard key={member._id} member={member} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Users className="w-32 h-32 text-border mx-auto mb-6" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-text-primary mb-4">Leadership Directory</h3>
                            <p className="text-text-secondary text-lg max-w-md mx-auto">
                                Our leadership team directory is currently being updated. Check back soon to meet our dedicated team members.
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default OurTeamPage;
