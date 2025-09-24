import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import QRCode from "react-qr-code";
import api from '../api/api';
import { Heart, ArrowRight, Loader2, Info, Users, Award, Sparkles } from 'lucide-react';
import sucssLogo from '../assets/sucss.png';

// --- IMPORTANT: CONFIGURE YOUR UPI DETAILS HERE ---
const UPI_CONFIG = {
    VPA: "sasmalsuman04@oksbi", // Your UPI Virtual Payment Address
    PAYEE_NAME: "Sijgeria UCS Sangha", // The name that will appear in the user's UPI app
};

const DonatePage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', amount: 500 });
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const amountOptions = [100, 250, 500, 1000];

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
        setLoading(true);
        try {
            await api.post('/donation/create', formData);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to proceed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const upiString = `upi://pay?pa=${UPI_CONFIG.VPA}&pn=${encodeURIComponent(UPI_CONFIG.PAYEE_NAME)}&am=${formData.amount}&cu=INR&tn=Donation to SUCSS`;

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
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Support Our Community</h1>
                                <p className="text-text-secondary text-sm">Every contribution helps</p>
                            </div>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
                            Your Donation Empowers <span className="text-primary">Our Mission</span>.
                        </h2>
                        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                            Your generous support is vital for our initiatives. Each donation helps us organize events, support community members, and preserve our rich cultural heritage.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Users size={18} /></div><span className="text-sm">Fund community welfare programs.</span></div>
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Sparkles size={18} /></div><span className="text-sm">Organize cultural and youth events.</span></div>
                            <div className="flex items-center gap-4 text-text-secondary"><div className="p-2 rounded-lg bg-primary/10 text-primary"><Award size={18} /></div><span className="text-sm">Support educational initiatives for all ages.</span></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <img src={sucssLogo} alt="Club Logo" className="w-20 h-20 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Make a Donation</h2>
                        <p className="text-text-secondary">Your generosity is greatly appreciated.</p>
                    </div>

                    <div className="bg-surface border border-border rounded-xl shadow-lg p-8">
                        {step === 1 ? (
                            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleDetailsSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">Choose an Amount</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {amountOptions.map(opt => (
                                            <button type="button" key={opt} onClick={() => handleAmountSelect(opt)} className={`p-3 rounded-lg border-2 font-bold transition-colors ${formData.amount === opt && customAmount === '' ? 'bg-primary border-primary text-white' : 'bg-background border-border hover:border-primary/50'}`}>
                                                ₹{opt}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative mt-4">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">₹</span>
                                        <input type="number" placeholder="Custom Amount" value={customAmount} onChange={handleCustomAmountChange} className="w-full pl-7 pr-3 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-0"/>
                                    </div>
                                </div>
                                <div className="border-t border-border !mt-8 pt-6 space-y-4">
                                    <h3 className="text-lg font-semibold text-text-primary text-center">Your Details</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-background border border-border rounded-lg p-2.5" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover disabled:opacity-50 !mt-8">
                                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                                    <span>Proceed to Pay ₹{formData.amount}</span>
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                <h2 className="text-2xl font-semibold text-text-primary">Scan to Pay</h2>
                                <p className="text-text-secondary mt-2">Use any UPI app (GPay, PhonePe, etc.)</p>
                                <div className="bg-white p-4 rounded-lg inline-block mt-6 border-4 border-primary">
                                    <QRCode value={upiString} size={200} />
                                </div>
                                <div className="mt-6 text-left bg-background p-4 rounded-lg border border-border">
                                    <p className="text-text-secondary text-sm">Amount: <span className="font-bold text-text-primary">₹{formData.amount}</span></p>
                                    <p className="text-text-secondary text-sm">To: <span className="font-bold text-text-primary">{UPI_CONFIG.PAYEE_NAME}</span></p>
                                </div>
                                <div className="mt-6 text-left bg-primary/10 p-4 rounded-lg border border-primary/20 flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-primary">Please Note</h4>
                                        <p className="text-sm text-text-secondary mt-1">
                                            Once you complete the payment on your UPI app, you can safely close this page. Thank you for your generous support!
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setStep(1)} className="mt-8 text-sm text-primary hover:underline">
                                    Change Amount or Details
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DonatePage;
