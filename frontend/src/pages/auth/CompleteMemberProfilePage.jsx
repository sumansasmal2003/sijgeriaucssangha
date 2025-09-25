import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Image as ImageIcon, CheckCircle, Loader2, UserCheck, Shield, Sparkles, Users, Award, Calendar, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';


const CompleteMemberProfilePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { loadMember } = useAuth();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        profileImage: null,
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profileImage: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (formData.password.length < 8) {
            return toast.error("Password must be at least 8 characters long!");
        }
        if (!formData.profileImage) {
            return toast.error("Please upload a profile image.");
        }

        setLoading(true);
        const completeProfileData = new FormData();
        completeProfileData.append('password', formData.password);
        completeProfileData.append('confirmPassword', formData.confirmPassword);
        completeProfileData.append('profileImage', formData.profileImage);

        try {
            await api.put(`/members/profile/complete/${token}`, completeProfileData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await loadMember();
            toast.success('Profile completed successfully! Welcome to our community.');
            navigate('/member/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Profile completion failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/3 to-primary/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Left Side - Enhanced Brand Section */}
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
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary to-primary shadow-2xl">
                                <UserCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-text-primary">Member Onboarding</h1>
                                <p className="text-text-secondary text-sm">Complete your profile to get started</p>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6 leading-tight"
                        >
                            Complete Your <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Member Profile</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-text-secondary mb-8 leading-relaxed"
                        >
                            Welcome to Sijgeria UCS Sangha! Complete your profile setup to unlock full access
                            to our community platform and start participating in our events and initiatives.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4 mb-8"
                        >
                            {[
                                { icon: Shield, text: "Enhanced security with your personalized password" },
                                { icon: Users, text: "Full access to member-only features and events" },
                                { icon: Award, text: "Exclusive member benefits and recognition" },
                                { icon: Calendar, text: "Priority registration for events and programs" },
                                { icon: Sparkles, text: "Personalized community experience" }
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-4 text-text-secondary group"
                                >
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                        <benefit.icon size={18} />
                                    </div>
                                    <span className="text-sm group-hover:text-text-primary transition-colors">{benefit.text}</span>
                                </motion.div>
                            ))}
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
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-secondary/10 border border-secondary/20">
                            <Zap className="w-5 h-5 text-secondary" />
                            <span className="text-sm font-black text-secondary uppercase tracking-wider">Profile Setup</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Activate Your Account</h2>
                        <p className="text-text-secondary">Secure your account and personalize your profile</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-black text-text-secondary mb-2">Create Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter a strong password"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-text-secondary mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Re-enter your password"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-text-secondary mb-3">Profile Image</label>
                            <div className="space-y-4">
                                {imagePreview && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex justify-center"
                                    >
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-border/50 shadow-lg group">
                                            <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </motion.div>
                                )}
                                <motion.div whileHover={{ scale: 1.02 }} className="relative">
                                    <input
                                        id="profileImage"
                                        name="profileImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20 transition-colors cursor-pointer"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-black hover:shadow-2xl hover:shadow-secondary/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Activating Account...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    <span>Complete Profile & Login</span>
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CompleteMemberProfilePage;
