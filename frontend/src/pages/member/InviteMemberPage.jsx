import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Send, Loader2, ShieldCheck, Users, Award, Mail, Phone, User, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomDropdown from '../../components/CustomDropdown';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
};

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
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Left Side - Info Section (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface/80 to-background/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-lg"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Grow Our Community</h1>
                                <p className="text-text-secondary text-sm">Invite a new member to join</p>
                            </div>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                            Extend an <span className="text-primary">Invitation</span> to Join the Family
                        </h2>

                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            Help strengthen our community by inviting passionate individuals. They'll receive a secure invitation to complete their profile and join our mission.
                        </p>

                        <div className="space-y-4 mb-8">
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
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center gap-4 text-text-secondary group"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm group-hover:text-text-primary transition-colors">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                                <span>All invitations are secure and require email verification.</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Back Button for Mobile */}
                    <Link
                        to="/member/dashboard"
                        className="lg:hidden flex items-center gap-2 text-text-secondary hover:text-primary transition-all duration-300 group mb-6"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Dashboard</span>
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Invite New Member</h2>
                        <p className="text-text-secondary">They'll receive an email to complete their profile</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                            <label className="block text-sm font-medium text-text-secondary mb-2">
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
                            <label className="block text-sm font-medium text-text-secondary mb-2">
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
                            className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="mt-6 p-4 rounded-xl bg-surface/30 border border-border/30">
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={16} className="text-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-text-secondary">
                                    The invited member will receive a secure link to complete their profile.
                                    Their information is protected and encrypted.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InviteMemberPage;
