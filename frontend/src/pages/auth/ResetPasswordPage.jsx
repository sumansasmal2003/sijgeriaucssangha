import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { Lock, CheckCircle, Loader2, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const role = new URLSearchParams(location.search).get('role') || 'user';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long.");
        }
        setLoading(true);

        const url = role === 'user' ? `/user/password/reset/${token}` : `/member/password/reset/${token}`;

        try {
            await api.put(url, { password, confirmPassword });
            toast.success('Password reset successfully!');
            setSubmitted(true); // Show success screen
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed. The link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Left Side - Info Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface to-background relative overflow-hidden">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-lg">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Account Security</h1>
                                <p className="text-text-secondary text-sm">Create a new, secure password</p>
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                            Set a New Password for Your Account.
                        </h2>
                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            For your security, please choose a strong, unique password that you haven't used on other websites.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-text-secondary">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><KeyRound size={18} /></div>
                                <span className="text-sm">Must be at least 8 characters long.</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><ShieldCheck size={18} /></div>
                                <span className="text-sm">Combine uppercase, lowercase, numbers, and symbols.</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
                    {submitted ? (
                         <div className="text-center">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-500/10 rounded-full border-4 border-green-500/20 mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-text-primary mb-2">Password Updated!</h2>
                                <p className="text-text-secondary mb-6">
                                    Your password has been reset successfully. You can now log in with your new credentials.
                                </p>
                                <Link to="/login" className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
                                    <ArrowRight size={20} />
                                    <span>Proceed to Login</span>
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-text-primary mb-2">Create New Password</h2>
                                <p className="text-text-secondary">Please enter and confirm your new password below.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                        <input
                                            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                            placeholder="Enter a strong password"
                                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                        <input
                                            id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                            placeholder="Re-enter your new password"
                                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={loading}
                                    className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold disabled:opacity-50"
                                >
                                    {loading ? (
                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Saving...</span></>
                                    ) : (
                                        <><CheckCircle size={20} /><span>Reset Password</span></>
                                    )}
                                </motion.button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
