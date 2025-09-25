import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { User, Mail, Lock, Phone, KeyRound, CheckCircle, Loader2, Sparkles, Shield, Users, Award, RefreshCw, Zap, ArrowRight, Target } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const UserRegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        avatar: null,
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");
        if (formData.password.length < 8) return toast.error("Password must be at least 8 characters long.");
        if (!formData.avatar) return toast.error("Please upload a profile image.");

        setLoading(true);
        const registrationData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'confirmPassword') {
                registrationData.append(key === 'avatar' ? 'profileImage' : key, formData[key]);
            }
        });

        try {
            const { data } = await api.post('/user/register', registrationData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(data.message);
            setStep(2);
            setResendCooldown(60);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/user/verify-email', { email: formData.email, otp });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        try {
            const { data } = await api.post('/user/resend-otp', { email: formData.email });
            toast.success(data.message);
            setResendCooldown(60);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            <Helmet>
                <title>Register - Sijgeria UCS Sangha</title>
                <meta name="description" content="Join our community as a volunteer to make a difference. Create your account and start participating in our initiatives." />
            </Helmet>

            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-2000"></div>
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
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-text-primary">Join Our Community</h1>
                                <p className="text-text-secondary text-sm">Become a Volunteer Today</p>
                            </div>
                        </motion.div>

                        <motion.h2
                            variants={fadeIn}
                            className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-6 leading-tight"
                        >
                            Be a Part of Something <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Bigger</span>.
                        </motion.h2>

                        <motion.p
                            variants={fadeIn}
                            className="text-lg text-text-secondary mb-8 leading-relaxed"
                        >
                            By creating an account, you're taking the first step towards making a real impact. Join a network of passionate volunteers dedicated to fostering culture, community, and progress.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="space-y-4"
                        >
                            {[
                                { icon: Users, text: "Participate in exclusive events and initiatives." },
                                { icon: Award, text: "Contribute your skills for a greater good." },
                                { icon: Shield, text: "Connect with like-minded individuals." }
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
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-wider">
                                {step === 1 ? "Create Account" : "Verify Email"}
                            </span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight mb-2">
                            {step === 1 ? "Join as Volunteer" : "Verify Your Email"}
                        </h2>
                        <p className="text-text-secondary">
                            {step === 1 ? "Start your journey with our community." : `OTP sent to ${formData.email}`}
                        </p>
                    </motion.div>

                    {step === 1 ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Full Name"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Email Address"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Contact Number"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Create Password"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Confirm Password"
                                        className="w-full pl-10 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-text-secondary mb-3">Profile Image</label>
                                {imagePreview && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex justify-center mb-4"
                                    >
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-border/50 shadow-lg group">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    </motion.div>
                                )}
                                <input
                                    type="file"
                                    name="avatar"
                                    onChange={handleFileChange}
                                    required
                                    accept="image/*"
                                    className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-black disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 !mt-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full text-center tracking-[0.5em] font-black text-2xl py-4 bg-surface/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    maxLength={6}
                                />
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
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Verify & Create Account</span>
                                    </>
                                )}
                            </motion.button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0 || resendLoading}
                                    className="group inline-flex items-center gap-2 text-sm text-primary font-black hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw size={16} className="group-hover:rotate-180 transition-transform" />
                                    )}
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center mt-8 pt-6 border-t border-border/50">
                        <p className="text-text-secondary text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="group inline-flex items-center gap-1 text-primary font-black hover:underline">
                                Sign In
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserRegisterPage;
