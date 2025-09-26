import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Lock, Save, Loader2, Zap, Shield, Sparkles } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};


const ProfileSettingsPage = () => {
    const { user, loadUser } = useAuth();
    const [imagePreview, setImagePreview] = useState(user.profileImage?.url);
    const [profileData, setProfileData] = useState({
        fullName: user.fullName,
        phone: user.phone,
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
            reader.onloadend = () => { setImagePreview(reader.result); };
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
        formData.append('fullName', profileData.fullName);
        formData.append('phone', profileData.phone);
        if (profileData.profileImage) {
            formData.append('profileImage', profileData.profileImage);
        }

        try {
            await api.put('/user/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await loadUser();
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
            await api.put('/user/password/update', passwordData);
            toast.success('Password updated successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                        >
                            <Zap className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Profile Settings</span>
                        </motion.div>
                        <h1 className="text-5xl font-black tracking-tight text-text-primary mb-4">
                            Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Profile</span> Settings
                        </h1>
                        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                            Manage your personal information and keep your account secure
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                        {/* Enhanced Update Profile Form */}
                        <motion.div
                            variants={fadeIn}
                            className="group relative bg-surface/50 backdrop-blur-sm rounded-3xl p-8 space-y-6 border border-border/50 hover:border-blue-400/30 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-text-primary mb-6 flex items-center gap-3">
                                    <User className="w-8 h-8 text-blue-400" />
                                    Update Details
                                </h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-400/50 shadow-2xl"
                                            />
                                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-2 rounded-full shadow-lg">
                                                <Sparkles size={16} />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-text-secondary mb-3">Profile Image</label>
                                            <input
                                                type="file"
                                                name="profileImage"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-bold file:bg-gradient-to-r file:from-blue-500/10 file:to-cyan-500/10 file:text-blue-400 hover:file:from-blue-500/20 hover:file:to-cyan-500/20 transition-all duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-3">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleProfileChange}
                                            className="w-full bg-background/50 border border-border/50 rounded-xl p-4 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-3">Contact Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="w-full bg-background/50 border border-border/50 rounded-xl p-4 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                        />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={loadingProfile}
                                        whileHover={{ scale: loadingProfile ? 1 : 1.02 }}
                                        whileTap={{ scale: loadingProfile ? 1 : 0.98 }}
                                        className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black py-4 rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 disabled:opacity-50"
                                    >
                                        {loadingProfile ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5" />}
                                        <span>Save Profile</span>
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Enhanced Change Password Form */}
                        <motion.div
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                            className="group relative bg-surface/50 backdrop-blur-sm rounded-3xl p-8 space-y-6 border border-border/50 hover:border-cyan-400/30 transition-all duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-text-primary mb-6 flex items-center gap-3">
                                    <Lock className="w-8 h-8 text-cyan-400" />
                                    Change Password
                                </h2>
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-3">Current Password</label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full bg-background/50 border border-border/50 rounded-xl p-4 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-3">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full bg-background/50 border border-border/50 rounded-xl p-4 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-3">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full bg-background/50 border border-border/50 rounded-xl p-4 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                        />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={loadingPassword}
                                        whileHover={{ scale: loadingPassword ? 1 : 1.02 }}
                                        whileTap={{ scale: loadingPassword ? 1 : 0.98 }}
                                        className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black py-4 rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 disabled:opacity-50"
                                    >
                                        {loadingPassword ? <Loader2 className="animate-spin w-5 h-5"/> : <Shield className="w-5 h-5" />}
                                        <span>Update Password</span>
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;
