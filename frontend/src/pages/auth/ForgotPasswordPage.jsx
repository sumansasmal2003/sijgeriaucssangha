import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { Mail, KeyRound, UserCheck, ShieldCheck, ArrowRight, CheckCircle, MailCheck, Sparkles, Send, Zap, Target, Users, Award } from 'lucide-react';

// Animation variants matching homepage
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

const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const ForgotPasswordPage = () => {
    const location = useLocation();
    const initialRole = new URLSearchParams(location.search).get('role') || 'user';

    const [email, setEmail] = useState('');
    const [role, setRole] = useState(initialRole);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = role === 'user' ? '/user/password/forgot' : '/member/password/forgot';

        try {
            const { data } = await api.post(url, { email });
            toast.success(data.message);
            setSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const tabStyle = (tabName) => `
        w-full py-4 px-6 text-base font-black text-center cursor-pointer transition-all duration-300 ease-in-out
        flex items-center justify-center gap-3 rounded-2xl
        ${role === tabName
            ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-2xl shadow-primary/25 transform -translate-y-1'
            : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50 hover:border-primary/30'
        }
    `;

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-500/3 to-cyan-500/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Left Side - Enhanced Info Section */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10">
                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="max-w-lg"
                    >
                        <motion.div variants={scaleIn} className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-2xl">
                                <KeyRound className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-text-primary">Password Recovery</h1>
                                <p className="text-text-secondary text-sm">Securely reset your account password</p>
                            </div>
                        </motion.div>

                        <motion.h2
                            variants={fadeIn}
                            className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6 leading-tight"
                        >
                            Don't Worry, We've Got You <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">Covered</span>.
                        </motion.h2>

                        <motion.p
                            variants={fadeIn}
                            className="text-lg text-text-secondary mb-8 leading-relaxed"
                        >
                            Forgot your password? It happens to the best of us. Just enter your registered email address, and we'll send you a secure link to reset your password and get you back on track.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4 text-text-secondary group">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <MailCheck size={18} />
                                </div>
                                <span className="text-sm group-hover:text-text-primary transition-colors">Receive a secure reset link via email.</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary group">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-sm group-hover:text-text-primary transition-colors">Your account security is our top priority.</span>
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
                                <MailCheck className="w-12 h-12 text-green-500 relative z-10" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                                Check Your Email
                            </h2>
                            <p className="text-text-secondary mb-8 text-lg leading-relaxed">
                                We've sent a password reset link to <span className="font-black text-text-primary">{email}</span>. Please follow the instructions to continue.
                            </p>
                            <Link
                                to="/login"
                                className="group inline-flex items-center justify-center gap-3 py-4 px-8 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                <span>Back to Login</span>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-center mb-8"
                            >
                                <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                                    <Zap className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-black text-primary uppercase tracking-wider">Password Recovery</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight mb-2">Reset Your Password</h2>
                                <p className="text-text-secondary">Enter your email to receive a secure reset link</p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-text-secondary mb-3">Select Account Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <motion.button
                                            type="button"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setRole('user')}
                                            className={tabStyle('user')}
                                        >
                                            <Sparkles size={20} /> Volunteer
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            whileHover={{ y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setRole('member')}
                                            className={tabStyle('member')}
                                        >
                                            <UserCheck size={20} /> Member
                                        </motion.button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-black text-text-secondary mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-black disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Sending Link...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span>Send Reset Link</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="text-center mt-8 pt-6 border-t border-border/50">
                                <p className="text-text-secondary text-sm">
                                    Remember your password?{' '}
                                    <Link to="/login" className="group inline-flex items-center gap-1 text-primary font-black hover:underline">
                                        Sign In
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
