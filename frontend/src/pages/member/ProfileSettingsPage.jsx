import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Lock, Save, Loader2, Image as ImageIcon, Zap, Shield, Mail, Phone } from 'lucide-react';

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

const ProfileSettingsPage = () => {
    const { member, loadMember } = useAuth();
    const [imagePreview, setImagePreview] = useState(member.profileImage?.url);
    const [profileData, setProfileData] = useState({
        firstName: member.firstName,
        lastName: member.lastName,
        phone: member.phone || '',
        profileImage: null,
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({ ...profileData, profileImage: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);

        const formData = new FormData();
        formData.append('firstName', profileData.firstName);
        formData.append('lastName', profileData.lastName);
        formData.append('phone', profileData.phone);
        if (profileData.profileImage) {
            formData.append('profileImage', profileData.profileImage);
        }

        try {
            await api.put('/member/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await loadMember();
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoadingPassword(true);
        try {
            await api.put('/member/password/update', passwordData);
            toast.success('Password updated successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoadingPassword(false);
        }
    };

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
                        <User className="w-5 h-5 text-primary" />
                        <span className="text-sm font-black text-primary uppercase tracking-wider">Profile Settings</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-text-primary mb-4">
                        Manage Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Profile</span>
                    </h1>
                    <p className="text-lg text-text-secondary">Update your personal information and account security settings</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Enhanced Profile Update Form */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        className="relative"
                    >
                        <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-text-primary flex items-center gap-3 mb-6">
                                    <User size={24} className="text-primary" />
                                    Personal Information
                                </h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-2xl object-cover border-4 border-primary/50 shadow-lg"
                                            />
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-surface">
                                                <ImageIcon size={16} className="text-white" />
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            id="profileImage"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-text-secondary mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleProfileChange}
                                                className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-text-secondary mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleProfileChange}
                                                className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-text-secondary mb-2">Contact Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                className="w-full pl-10 bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loadingProfile}
                                        whileHover={{ scale: loadingProfile ? 1 : 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-primary to-primary-hover text-white font-black py-3 rounded-xl hover:shadow-xl disabled:opacity-50 transition-all duration-300"
                                    >
                                        {loadingProfile ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        <span>{loadingProfile ? 'Saving...' : 'Save Profile'}</span>
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Password Update Form */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-red-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-text-primary flex items-center gap-3 mb-6">
                                    <Lock size={24} className="text-secondary" />
                                    Security Settings
                                </h2>
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-black text-text-secondary mb-2">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={passwordData.oldPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full pl-10 bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-text-secondary mb-2">New Password</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full pl-10 bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-text-secondary mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full pl-10 bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loadingPassword}
                                        whileHover={{ scale: loadingPassword ? 1 : 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-secondary to-red-500 text-white font-black py-3 rounded-xl hover:shadow-xl disabled:opacity-50 transition-all duration-300"
                                    >
                                        {loadingPassword ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                        <span>{loadingPassword ? 'Updating...' : 'Update Password'}</span>
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;
