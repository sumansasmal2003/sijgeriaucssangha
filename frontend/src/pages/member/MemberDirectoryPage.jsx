import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users, Mail, Phone, Award, Zap, Sparkles, UserCheck } from 'lucide-react';

// Animation variants
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
            staggerChildren: 0.1
        }
    }
};

// Enhanced MemberCard Component
const MemberCard = ({ member, index }) => {
    const designationColors = {
        'President': 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
        'Secretary': 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
        'Admin': 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
        'Member': 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400'
    };

    const colorClass = designationColors[member.designation] || designationColors['Member'];

    return (
        <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            custom={index}
            className="group relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 text-center flex flex-col items-center transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-xl h-full">
                <div className="relative mb-4">
                    <img
                        src={member.profileImage?.url}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/50 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-surface">
                        <UserCheck size={12} className="text-white" />
                    </div>
                </div>

                <h3 className="text-lg font-black text-text-primary mb-1">{member.firstName} {member.lastName}</h3>

                <div className={`px-3 py-1 rounded-full text-xs font-black border ${colorClass} mb-3`}>
                    {member.designation}
                </div>

                <div className="space-y-2 text-sm w-full">
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                        <Mail size={14} className="text-primary" />
                        <span className="font-medium truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-text-secondary">
                        <Phone size={14} className="text-primary" />
                        <span className="font-medium">{member.phone}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MemberDirectoryPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/member/directory');
            setMembers(data.members);
        } catch (error) {
            toast.error('Could not fetch member directory.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

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
                    <p className="text-text-secondary text-lg">Loading member directory...</p>
                </motion.div>
            </div>
        );
    }

    return (
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
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-sm font-black text-primary uppercase tracking-wider">Member Directory</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-text-primary mb-4">
                        Meet Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Community</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Discover the dedicated members who make our community vibrant and strong.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {members.map((member, index) => (
                        <MemberCard key={member._id} member={member} index={index} />
                    ))}
                </motion.div>

                {members.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={40} className="text-border" />
                        </div>
                        <h3 className="text-2xl font-black text-text-primary mb-3">No Members Found</h3>
                        <p className="text-text-secondary text-lg">The member directory is currently empty.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MemberDirectoryPage;
