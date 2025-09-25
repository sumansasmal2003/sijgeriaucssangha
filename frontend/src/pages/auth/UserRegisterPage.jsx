import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { User, Mail, Lock, Phone, KeyRound, CheckCircle, Loader2, Sparkles, Shield, Users, Award, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
            setResendCooldown(60); // Start cooldown on initial send
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
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
          <Helmet>
                <title>Register - Sijgeria UCS Sangha</title>
                <meta name="description" content="Join our community as a volunteer to make a difference. Create your account and start participating in our initiatives." />
            </Helmet>
            {/* Left Side - Info Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface to-background relative overflow-hidden">
                 <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-lg">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Join Our Community</h1>
                                <p className="text-text-secondary text-sm">Become a Volunteer Today</p>
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                            Be a Part of Something <span className="text-primary">Bigger</span>.
                        </h2>
                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            By creating an account, you're taking the first step towards making a real impact. Join a network of passionate volunteers dedicated to fostering culture, community, and progress.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Users size={18} /></div><span className="text-sm">Participate in exclusive events and initiatives.</span></div>
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Award size={18} /></div><span className="text-sm">Contribute your skills for a greater good.</span></div>
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Shield size={18} /></div><span className="text-sm">Connect with like-minded individuals.</span></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">
                            {step === 1 ? "Create Your Account" : "Verify Your Email"}
                        </h2>
                        <p className="text-text-secondary">
                            {step === 1 ? "Join as a volunteer to make a difference." : `An OTP has been sent to ${formData.email}.`}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Full Name" className="w-full pl-4 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Email Address" className="w-full pl-4 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Contact Number" className="w-full pl-4 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/>
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Create Password" className="w-full pl-4 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required placeholder="Confirm Password" className="w-full pl-4 pr-4 py-3 bg-surface/50 border border-border/50 rounded-xl"/>

                            {imagePreview && <div className="flex justify-center"><img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-border/50"/></div>}
                            <input type="file" name="avatar" onChange={handleFileChange} required accept="image/*" className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-primary/10 file:text-primary"/>

                            <motion.button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-4 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 !mt-6">
                                {loading ? <><Loader2 className="animate-spin"/><span>Processing...</span></> : <span>Register</span>}
                            </motion.button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter 6-digit OTP" className="w-full text-center tracking-[0.5em] font-bold text-2xl py-3 bg-surface/50 border border-border/50 rounded-xl"/>
                            <motion.button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-3 py-4 rounded-xl bg-primary text-white font-semibold disabled:opacity-50">
                                {loading ? <><Loader2 className="animate-spin"/><span>Verifying...</span></> : <><CheckCircle/><span>Verify & Create Account</span></>}
                            </motion.button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0 || resendLoading}
                                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                >
                                    {resendLoading ? <Loader2 className="animate-spin" size={16}/> : <RefreshCw size={14} />}
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center mt-8 pt-6 border-t border-border/50">
                        <p className="text-text-secondary text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserRegisterPage;
