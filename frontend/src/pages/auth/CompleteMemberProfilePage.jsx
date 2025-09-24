import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Image as ImageIcon, CheckCircle, Loader2, UserCheck, Shield, Sparkles, Users, Award, Calendar } from 'lucide-react';
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
        if (formData.password.length < 8) { // Assuming 8 is your minimum password length
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
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* --- Left Side - Brand/Info Section (Hidden on Mobile) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface/80 to-background/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10"></div>
                <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-lg"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary to-primary shadow-lg">
                                <UserCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Member Onboarding</h1>
                                <p className="text-text-secondary text-sm">Complete your profile to get started</p>
                            </div>
                        </div>

                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-6 leading-tight">
                            Complete Your <span className="text-secondary">Member Profile</span>
                        </h2>

                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            Welcome to Sijgeria UCS Sangha! Complete your profile setup to unlock full access
                            to our community platform and start participating in our events and initiatives.
                        </p>

                        <div className="space-y-4 mb-8">
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
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center gap-4 text-text-secondary group"
                                >
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                        <benefit.icon size={18} />
                                    </div>
                                    <span className="text-sm group-hover:text-text-primary transition-colors">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- Right Side - Form Section --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Profile Setup</h2>
                        <p className="text-text-secondary">Secure your account and personalize your profile</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Create Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required placeholder="Enter a strong password"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required placeholder="Re-enter your password"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-3">Profile Image</label>
                            <div className="space-y-4">
                                {imagePreview && (
                                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-border/50 shadow-lg">
                                            <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                        </div>
                                    </motion.div>
                                )}
                                <div className="relative">
                                    <input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleFileChange} required
                                        className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                            className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:shadow-lg hover:shadow-secondary/25 transition-all duration-300 disabled:opacity-50">
                            {loading ? (
                                <><Loader2 size={20} className="animate-spin" /><span>Activating Account...</span></>
                            ) : (
                                <><CheckCircle size={20} /><span>Complete Profile & Login</span></>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CompleteMemberProfilePage;
