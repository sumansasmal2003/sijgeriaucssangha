import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Send, Loader2, ShieldCheck, Users, Award, Mail, Phone, User, Sparkles, ArrowLeft, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../../components/CustomDropdown';

const InviteMemberPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: 'Member',
    });
    const [loading, setLoading] = useState(false);

    const designationOptions = [
        { name: 'Member', value: 'Member' },
        { name: 'Secretary', value: 'Secretary' },
        { name: 'President', value: 'President' },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDesignationChange = (value) => {
        setFormData(prev => ({ ...prev, designation: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/member/invite', formData);
            toast.success(data.message || 'Invitation sent successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                designation: 'Member',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send invitation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Left Side - Enhanced Info Section */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10">
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
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-2xl">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-text-primary">Grow Our Community</h1>
                                <p className="text-text-secondary text-sm">Invite a new member to join</p>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6 leading-tight"
                        >
                            Extend an <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Invitation</span> to Join the Family
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-text-secondary mb-8 leading-relaxed"
                        >
                            Help strengthen our community by inviting passionate individuals. They'll receive a secure invitation to complete their profile and join our mission.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4 mb-8"
                        >
                            {[
                                { icon: ShieldCheck, text: "Secure onboarding process with email verification" },
                                { icon: Users, text: "Expand our network of dedicated community members" },
                                { icon: Award, text: "Recognize contributions with appropriate designations" },
                                { icon: Sparkles, text: "Build a diverse and vibrant community together" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-4 text-text-secondary group"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm group-hover:text-text-primary transition-colors">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="p-4 rounded-xl bg-surface/50 border border-border/50 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                                <span className="font-medium">All invitations are secure and require email verification.</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Enhanced Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Back Button for Mobile */}
                    <Link
                        to="/member/dashboard"
                        className="lg:hidden flex items-center gap-3 text-text-secondary hover:text-primary transition-all duration-300 group mb-6"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Dashboard</span>
                    </Link>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-wider">Invite Member</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Welcome New Member</h2>
                        <p className="text-text-secondary">They'll receive an email to complete their profile</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-black text-text-secondary mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter first name"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-text-secondary mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter last name"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-black text-text-secondary mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                    className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-black text-text-secondary mb-2">
                                Contact Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter phone number"
                                    className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Designation Dropdown */}
                        <CustomDropdown
                            label="Designation"
                            options={designationOptions}
                            selected={formData.designation}
                            setSelected={handleDesignationChange}
                            icon={Award}
                        />

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-black disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Sending Invitation...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    <span>Send Invitation</span>
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Security Note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 p-4 rounded-xl bg-surface/50 border border-border/50 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-text-secondary font-medium">
                                    The invited member will receive a secure link to complete their profile.
                                    Their information is protected and encrypted.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default InviteMemberPage;
