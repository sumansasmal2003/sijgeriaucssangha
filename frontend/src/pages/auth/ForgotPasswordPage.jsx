import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { Mail, KeyRound, UserCheck, ShieldCheck, ArrowRight, CheckCircle, MailCheck, Sparkles, Send } from 'lucide-react';

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
        } catch (error)
 {
            toast.error(error.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const tabStyle = (tabName) => `
        w-full py-3 px-4 text-sm font-semibold text-center cursor-pointer transition-all duration-300 ease-in-out
        flex items-center justify-center gap-2 rounded-xl
        ${role === tabName
            ? 'bg-primary text-white shadow-md shadow-primary/20'
            : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50'
        }
    `;

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Left Side - Info Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface to-background relative overflow-hidden">
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
                                <KeyRound className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Password Recovery</h1>
                                <p className="text-text-secondary text-sm">Securely reset your account password</p>
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                            Don't Worry, We've Got You Covered.
                        </h2>
                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            Forgot your password? It happens to the best of us. Just enter your registered email address, and we'll send you a secure link to reset your password and get you back on track.
                        </p>
                        <div className="space-y-4">
                             <div className="flex items-center gap-4 text-text-secondary">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><MailCheck size={18} /></div>
                                <span className="text-sm">Receive a secure reset link via email.</span>
                            </div>
                             <div className="flex items-center gap-4 text-text-secondary">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary"><ShieldCheck size={18} /></div>
                                <span className="text-sm">Your account security is our top priority.</span>
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
                    {submitted ? (
                        <div className="text-center">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-500/10 rounded-full border-4 border-green-500/20 mb-6">
                                    <MailCheck className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-text-primary mb-2">Check Your Email</h2>
                                <p className="text-text-secondary mb-6">
                                    We've sent a password reset link to <span className="font-semibold text-text-primary">{email}</span>. Please follow the instructions to continue.
                                </p>
                                <Link to="/login" className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
                                    <ArrowRight size={20} />
                                    <span>Back to Login</span>
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-text-primary mb-2">Forgot Password</h2>
                                <p className="text-text-secondary">Enter your email to receive a reset link.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Select Account Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" onClick={() => setRole('user')} className={tabStyle('user')}>
                                            <Sparkles size={18} /> Volunteer
                                        </button>
                                        <button type="button" onClick={() => setRole('member')} className={tabStyle('member')}>
                                            <UserCheck size={18} /> Member
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                        <input
                                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending Link...</span></>
                                    ) : (
                                        <><Send size={18} /><span>Send Reset Link</span></>
                                    )}
                                </motion.button>
                            </form>
                            <div className="text-center mt-8 pt-6 border-t border-border/50">
                                <p className="text-text-secondary text-sm">
                                    Remember your password?{' '}
                                    <Link to="/login" className="text-primary font-semibold hover:underline">
                                        Sign In
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
