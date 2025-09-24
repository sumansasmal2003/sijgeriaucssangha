import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { User, Lock, Save, Loader2 } from 'lucide-react';

const ProfileSettingsPage = () => {
    const { user, loadUser } = useAuth();
    const [imagePreview, setImagePreview] = useState(user.profileImage?.url);
    const [profileData, setProfileData] = useState({
        fullName: user.fullName,
        contactNumber: user.contactNumber,
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
        formData.append('contactNumber', profileData.contactNumber);
        if (profileData.profileImage) {
            formData.append('profileImage', profileData.profileImage);
        }

        try {
            await api.put('/user/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await loadUser(); // Refresh user data in context
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-text-primary">Your Profile Settings</h1>
                    <p className="mt-2 text-lg text-text-secondary">Manage your personal information and account security.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Update Profile Form */}
                    <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
                        <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-3"><User size={24}/> Update Details</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="flex flex-col items-center gap-4">
                                <img src={imagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-primary/50"/>
                                <input type="file" name="profileImage" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-primary/10 file:text-primary"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                                <input type="text" name="fullName" value={profileData.fullName} onChange={handleProfileChange} className="w-full bg-background border border-border rounded-lg p-2.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Contact Number</label>
                                <input type="tel" name="contactNumber" value={profileData.contactNumber} onChange={handleProfileChange} className="w-full bg-background border border-border rounded-lg p-2.5" />
                            </div>
                            <button type="submit" disabled={loadingProfile} className="w-full mt-4 flex justify-center items-center gap-2 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-hover disabled:opacity-50">
                                {loadingProfile ? <Loader2 className="animate-spin"/> : <Save size={18} />}
                                <span>Save Profile</span>
                            </button>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
                        <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-3"><Lock size={24}/> Change Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                                <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
                                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                            </div>
                            <button type="submit" disabled={loadingPassword} className="w-full mt-4 flex justify-center items-center gap-2 bg-secondary text-white font-semibold py-3 rounded-lg hover:bg-secondary/80 disabled:opacity-50">
                                 {loadingPassword ? <Loader2 className="animate-spin"/> : <Save size={18} />}
                                <span>Update Password</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;
