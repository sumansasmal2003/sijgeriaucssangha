import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import QRCode from "react-qr-code";
import api from '../api/api';
import { Heart, ArrowRight, Loader2, Info, Users, Award, Sparkles, Zap, Gift, Shield, Star, CheckCircle } from 'lucide-react';
import sucssLogo from '../assets/sucss.png';
import { Helmet } from 'react-helmet-async';

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

const slideInRight = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const UPI_CONFIG = {
    VPA: "sasmalsuman04@oksbi",
    PAYEE_NAME: "Sijgeria UCS Sangha",
};

const DonatePage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', amount: 500 });
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const amountOptions = [100, 250, 500, 1000, 2500, 5000];

    const handleAmountSelect = (amount) => {
        setFormData(prev => ({ ...prev, amount }));
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        setCustomAmount(value);
        if (Number(value) >= 10) {
            setFormData(prev => ({ ...prev, amount: Number(value) }));
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            return toast.error("Please fill in your name and email.");
        }
        if (formData.amount < 10) {
            return toast.error("Minimum donation amount is ₹10");
        }
        setLoading(true);
        try {
            await api.post('/donation/create', formData);
            setStep(2);
            toast.success("Donation initiated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to proceed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const upiString = `upi://pay?pa=${UPI_CONFIG.VPA}&pn=${encodeURIComponent(UPI_CONFIG.PAYEE_NAME)}&am=${formData.amount}&cu=INR&tn=Donation to SUCSS`;

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
          <Helmet>
                <title>Donate - Sijgeria UCS Sangha</title>
                <meta name="description" content="Support our mission and empower change through your generous donations. Your contribution fuels our community initiatives and cultural events." />
            </Helmet>
            {/* Enhanced Left Side - Info Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-surface/80 to-background/80 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>

                <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={slideInLeft}
                        className="max-w-2xl"
                    >
                        {/* Header Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                        >
                            <Heart className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-black text-blue-400 uppercase tracking-wider">Make a Difference</span>
                        </motion.div>

                        <h1 className="text-5xl lg:text-6xl font-black text-text-primary mb-6 leading-tight">
                            Your Donation <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Empowers Change</span>
                        </h1>

                        <p className="text-xl text-text-secondary mb-10 leading-relaxed font-light">
                            Your generous support fuels our initiatives, helping us organize transformative events,
                            support community members in need, and preserve our rich cultural heritage for future generations.
                        </p>

                        {/* Enhanced Features */}
                        <div className="space-y-6">
                            {[
                                { icon: Users, text: 'Fund community welfare programs and social initiatives', color: 'blue' },
                                { icon: Sparkles, text: 'Organize cultural festivals and youth development events', color: 'cyan' },
                                { icon: Award, text: 'Support educational scholarships and skill development', color: 'blue' },
                                { icon: Shield, text: '100% transparent fund utilization with regular updates', color: 'cyan' }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-center gap-4 text-text-secondary group"
                                >
                                    <div className={`p-3 rounded-xl bg-gradient-to-r from-${feature.color}-500/10 to-${feature.color === 'blue' ? 'cyan' : 'blue'}-500/10 text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon size={20} />
                                    </div>
                                    <span className="text-lg font-medium group-hover:text-text-primary transition-colors duration-300">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-border/50"
                        >
                            <div className="flex items-center gap-4">
                                <Shield className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h4 className="font-black text-text-primary">Secure & Transparent</h4>
                                    <p className="text-text-secondary text-sm">All donations are securely processed with complete transparency.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={slideInRight}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Enhanced Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-block mb-6"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-30"></div>
                                <img src={sucssLogo} alt="Club Logo" className="w-24 h-24 rounded-2xl border-2 border-border relative z-10 mx-auto" />
                            </div>
                        </motion.div>
                        <h2 className="text-4xl font-black text-text-primary mb-3">Support Our Mission</h2>
                        <p className="text-text-secondary text-lg">Your generosity creates lasting impact</p>
                    </div>

                    <div className="bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl shadow-2xl p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleDetailsSubmit}
                                    className="space-y-8"
                                >
                                    {/* Amount Selection */}
                                    <div>
                                        <h3 className="text-xl font-black text-text-primary mb-6 text-center">Choose Your Impact</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {amountOptions.map(opt => (
                                                <motion.button
                                                    type="button"
                                                    key={opt}
                                                    onClick={() => handleAmountSelect(opt)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`p-4 rounded-2xl border-2 font-black transition-all duration-300 relative group ${
                                                        formData.amount === opt && customAmount === ''
                                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white shadow-lg'
                                                            : 'bg-background border-border hover:border-blue-400/50 hover:shadow-md'
                                                    }`}
                                                >
                                                    ₹{opt}
                                                </motion.button>
                                            ))}
                                        </div>
                                        <div className="relative mt-6">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary text-lg">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Other Amount"
                                                value={customAmount}
                                                onChange={handleCustomAmountChange}
                                                className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:border-blue-400 focus:ring-0 text-lg font-semibold"
                                                min="10"
                                            />
                                        </div>
                                    </div>

                                    {/* Donor Details */}
                                    <div className="border-t-2 border-border/50 pt-8 space-y-6">
                                        <h3 className="text-xl font-black text-text-primary text-center">Your Details</h3>
                                        <div>
                                            <label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg focus:border-blue-400 focus:ring-0"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg focus:border-blue-400 focus:ring-0"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                        className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black py-5 rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-8 text-lg"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin w-6 h-6" />
                                        ) : (
                                            <>
                                                <Zap className="w-6 h-6" />
                                                <span>Donate ₹{formData.amount}</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center space-y-8"
                                >
                                    {/* Success Header */}
                                    <div className="text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4"
                                        >
                                            <Gift className="w-8 h-8 text-white" />
                                        </motion.div>
                                        <h2 className="text-3xl font-black text-text-primary">Almost There!</h2>
                                        <p className="text-text-secondary mt-2 text-lg">Scan the QR code with any UPI app</p>
                                    </div>

                                    {/* QR Code */}
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white p-6 rounded-3xl inline-block border-4 border-blue-400 shadow-2xl"
                                    >
                                        <QRCode value={upiString} size={220} />
                                    </motion.div>

                                    {/* Payment Details */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-6 rounded-2xl border-2 border-border/50"
                                    >
                                        <div className="space-y-3 text-left">
                                            <div className="flex justify-between items-center">
                                                <span className="text-text-secondary font-semibold">Amount:</span>
                                                <span className="font-black text-text-primary text-lg">₹{formData.amount}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-text-secondary font-semibold">Recipient:</span>
                                                <span className="font-black text-text-primary">{UPI_CONFIG.PAYEE_NAME}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-text-secondary font-semibold">UPI ID:</span>
                                                <span className="font-mono text-blue-400">{UPI_CONFIG.VPA}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Important Note */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border-2 border-blue-400/20 flex items-start gap-4"
                                    >
                                        <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-left">
                                            <h4 className="font-black text-blue-400 text-lg mb-2">Important</h4>
                                            <p className="text-text-secondary text-sm">
                                                Complete the payment in your UPI app, then you can safely close this page.
                                                You'll receive a confirmation email shortly. Thank you for your generous support!
                                            </p>
                                        </div>
                                    </motion.div>

                                    <motion.button
                                        onClick={() => setStep(1)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
                                    >
                                        ← Change donation details
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DonatePage;
