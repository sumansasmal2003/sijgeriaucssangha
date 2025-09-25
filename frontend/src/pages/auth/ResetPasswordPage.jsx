import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { Lock, CheckCircle, Loader2, KeyRound, ShieldCheck, ArrowRight, Zap, Sparkles } from 'lucide-react';

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
            setSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password reset failed. The link may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-green-500/3 to-cyan-500/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
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
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 shadow-2xl">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-text-primary">Account Security</h1>
                                <p className="text-text-secondary text-sm">Create a new, secure password</p>
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6 leading-tight"
                        >
                            Set a New <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Password</span>.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-text-secondary mb-8 leading-relaxed"
                        >
                            For your security, please choose a strong, unique password that you haven't used on other websites.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4 text-text-secondary group">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                                    <KeyRound size={18} />
                                </div>
                                <span className="text-sm group-hover:text-text-primary transition-colors">Must be at least 8 characters long.</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary group">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-sm group-hover:text-text-primary transition-colors">Combine uppercase, lowercase, numbers, and symbols.</span>
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
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className="text-center"
                        >
                            <div className="mx-auto w-24 h-24 flex items-center justify-center bg-green-500/10 rounded-full border-4 border-green-500/20 mb-6 relative">
                                <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
                                <CheckCircle className="w-12 h-12 text-green-500 relative z-10" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                                Password Updated!
                            </h2>
                            <p className="text-text-secondary mb-8 text-lg leading-relaxed">
                                Your password has been reset successfully. You can now log in with your new credentials.
                            </p>
                            <Link
                                to="/login"
                                className="group inline-flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                <span>Proceed to Login</span>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-center mb-8"
                            >
                                <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20">
                                    <Zap className="w-5 h-5 text-green-500" />
                                    <span className="text-sm font-black text-green-500 uppercase tracking-wider">Create New Password</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight mb-2">Secure Your Account</h2>
                                <p className="text-text-secondary">Please enter and confirm your new password below.</p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-text-secondary mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Enter a strong password"
                                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-text-secondary mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="Re-enter your new password"
                                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-black disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            <span>Reset Password</span>
                                        </>
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
