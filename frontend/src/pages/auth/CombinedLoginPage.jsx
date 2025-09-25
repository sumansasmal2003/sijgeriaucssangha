import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { LogIn, Mail, ShieldCheck, Users, Star, Calendar, Heart, UserCheck, Sparkles, ShieldAlert, Zap, Target, ArrowRight } from 'lucide-react';
import Countdown from '../../components/Countdown';

// Animation variants
const fadeIn = {
    initial: { opacity: 0, y: 40 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1
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

const CombinedLoginPage = () => {
    const [activeTab, setActiveTab] = useState('user');
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockInfo, setBlockInfo] = useState({ reason: '', until: null });

    const handleBlockedLogin = (reason, until) => {
        setIsBlocked(true);
        setBlockInfo({ reason, until });
    };

    const userLoginForm = useLoginForm('user', handleBlockedLogin);
    const memberLoginForm = useLoginForm('member', handleBlockedLogin);

    const tabStyle = (tabName) => `w-full py-4 px-6 text-base font-black text-center cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-3 rounded-2xl ${activeTab === tabName ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-2xl shadow-primary/25 transform -translate-y-1' : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50 hover:border-primary/30'}`;

    if (isBlocked) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-red-500/3 to-orange-500/3"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-400/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg text-center bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl p-8 relative z-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                        <div className="relative inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                            <ShieldAlert className="h-16 w-16 text-red-400" />
                        </div>
                    </motion.div>

                    <h1 className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        Account Blocked
                    </h1>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6">Your account has been temporarily suspended for the following reason:</p>

                    <div className="bg-background/50 p-6 rounded-2xl border border-border/50 mb-6 backdrop-blur-sm">
                        <p className="text-text-primary font-medium">{blockInfo.reason}</p>
                    </div>

                    <h2 className="text-xl font-black text-text-primary mb-6">Account will be unlocked in:</h2>
                    <Countdown expiryDate={blockInfo.until} />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-500/3 to-cyan-500/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl animate-float delay-3000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Left Side - Enhanced Brand Section */}
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
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-text-primary">Sijgeria UCS Sangha</h1>
                                <p className="text-text-secondary text-sm">Community • Culture • Progress</p>
                            </div>
                        </motion.div>

                        <motion.h2
                            variants={fadeIn}
                            className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6 leading-tight"
                        >
                            Welcome Back to Our <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">Community</span>
                        </motion.h2>

                        <motion.div variants={fadeIn} className="space-y-4">
                            {[
                                { icon: Users, text: "Connect with like-minded community members" },
                                { icon: Star, text: "Access exclusive events and programs" },
                                { icon: Heart, text: "Participate in meaningful social initiatives" },
                                { icon: Calendar, text: "Stay updated with community activities" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 text-text-secondary group">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-sm group-hover:text-text-primary transition-colors">{item.text}</span>
                                </div>
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
                        <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                            <UserCheck className="w-5 h-5 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-wider">Sign In</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-text-secondary">Choose your account type to continue</p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab('user')}
                            className={tabStyle('user')}
                        >
                            <LogIn size={20} /> User
                        </motion.button>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab('member')}
                            className={tabStyle('member')}
                        >
                            <UserCheck size={20} /> Member
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'user' ? userLoginForm : memberLoginForm}
                        </motion.div>
                    </AnimatePresence>

                    <div className="text-center mt-8 pt-6 border-t border-border/50">
                        <p className="text-text-secondary text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="group inline-flex items-center gap-1 text-primary font-black hover:underline">
                                Join our community
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const useLoginForm = (type, onBlocked) => {
    const navigate = useNavigate();
    const { loginUserContext, loginMemberContext } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const isUser = type === 'user';

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isUser ? '/user/login' : '/member/login';
            const { data } = await api.post(url, formData);

            if (data.success) {
                toast.success('Logged in successfully!');
                if (isUser) {
                    loginUserContext(data.user);
                    navigate('/user/dashboard');
                } else {
                    loginMemberContext(data.user);
                    navigate('/member/dashboard');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                const message = error.response.data.message;
                const reasonMatch = message.match(/Reason: (.*)/);
                const dateMatch = message.match(/until (.*)\. Reason/);
                const reason = reasonMatch ? reasonMatch[1] : "No reason provided.";
                const until = dateMatch ? new Date(dateMatch[1]) : new Date();
                onBlocked(reason, until);
            } else {
                toast.error(error.response?.data?.message || 'Login failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-black text-text-secondary mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-black text-text-secondary mb-2">Password</label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={onChange}
                            required
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <Link to={`/password/forgot?role=${type}`} className="text-sm font-black text-primary hover:underline">
                    Forgot Password?
                </Link>
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
                        <span>Logging in...</span>
                    </>
                ) : (
                    <>
                        <LogIn size={20} />
                        <span>Log In</span>
                    </>
                )}
            </motion.button>
        </form>
    );
};

export default CombinedLoginPage;
