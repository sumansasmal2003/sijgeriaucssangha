import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { LogIn, Mail, ShieldCheck, Users, Star, Calendar, Heart, UserCheck, Sparkles, ShieldAlert } from 'lucide-react';
import Countdown from '../../components/Countdown';
import { Helmet } from 'react-helmet-async';

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

    const tabStyle = (tabName) => `w-full py-4 px-6 text-base font-semibold text-center cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-3 rounded-xl ${activeTab === tabName ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25' : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50'}`;

    if (isBlocked) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center bg-surface border border-border rounded-xl shadow-lg p-8">
                    <ShieldAlert className="mx-auto h-16 w-16 text-secondary mb-4" />
                    <h1 className="text-3xl font-bold text-text-primary">Account Blocked</h1>
                    <p className="text-text-secondary mt-4 mb-6">Your account has been temporarily suspended for the following reason:</p>
                    <div className="bg-background p-4 rounded-lg border border-border/50 text-text-primary mb-6">
                        <p>{blockInfo.reason}</p>
                    </div>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Account will be unlocked in:</h2>
                    <Countdown expiryDate={blockInfo.until} />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
          <Helmet>
                <title>Login - Sijgeria UCS Sangha</title>
                <meta name="description" content="Access your member or user account to participate in events, manage your profile, and engage with the community." />
            </Helmet>
            {/* Left Side - Brand/Info Section (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface/80 to-background/80 relative overflow-hidden">
                 <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-lg">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Sijgeria UCS Sangha</h1>
                                <p className="text-text-secondary text-sm">Community • Culture • Progress</p>
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary mb-6 leading-tight">Welcome Back to Our <span className="text-primary">Community</span></h2>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Sign In</h2>
                        <p className="text-text-secondary">Choose your account type to continue</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab('user')} className={tabStyle('user')}><LogIn size={20} /> User Login</motion.button>
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab('member')} className={tabStyle('member')}><UserCheck size={20} /> Member Login</motion.button>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                            {activeTab === 'user' ? userLoginForm : memberLoginForm}
                        </motion.div>
                    </AnimatePresence>
                    <div className="text-center mt-8 pt-6 border-t border-border/50">
                        <p className="text-text-secondary text-sm">Don't have an account?{' '}<Link to="/register" className="text-primary font-semibold hover:underline">Join our community</Link></p>
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
            const { data } = await api.post(url, formData); // The login response includes the user object

            if (data.success) {
                toast.success('Logged in successfully!');
                if (isUser) {
                    // --- FIX: Directly set the user in the context ---
                    loginUserContext(data.user);
                    navigate('/user/dashboard');
                } else {
                    // --- FIX: Directly set the member in the context ---
                    loginMemberContext(data.user); // The backend returns 'user' key for both
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
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" /><input id="email" name="email" type="email" value={formData.email} onChange={onChange} required placeholder="Enter your email" className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/></div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                    <div className="relative"><ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" /><input id="password" name="password" type="password" value={formData.password} onChange={onChange} required placeholder="Enter your password" className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/></div>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <Link to={`/password/forgot?role=${type}`} className="text-sm font-medium text-primary hover:underline">Forgot Password?</Link>
            </div>
            <motion.button whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold disabled:opacity-50">
                {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Logging in...</span></>) : (<><LogIn size={20} /><span>Log In</span></>)}
            </motion.button>
        </form>
    );
};

export default CombinedLoginPage;
