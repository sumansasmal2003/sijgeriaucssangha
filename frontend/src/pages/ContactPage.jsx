import React, { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Mail, Phone, MapPin, MessageCircle, Zap, User, Target, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/contact/submit', formData);
            toast.success(data.message);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden">
          <Helmet>
                <title>Contact Us - Sijgeria UCS Sangha</title>
                <meta name="description" content="Get in touch with us. Whether you have a question, feedback, or a proposal, our team is here to help and connect with you." />
            </Helmet>
            {/* Enhanced Hero Section */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-surface/30 to-background">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Header Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                        >
                            <MessageCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-black text-blue-400 uppercase tracking-wider">Get In Touch</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                            Let's <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Connect</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-light">
                            We'd love to hear from you. Whether you have a question, feedback, or a proposal,
                            our team is here to help and connect with you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Content Section */}
            <section className="relative py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
                        {/* Enhanced Left Side - Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="space-y-8"
                        >
                            <div className="bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 lg:p-10">
                                <h2 className="text-3xl font-black text-text-primary mb-6">Contact Information</h2>
                                <p className="text-text-secondary text-lg mb-8 font-light">
                                    Our dedicated team is available to assist you with any inquiries.
                                    Feel free to reach out through any of the channels below.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        {
                                            icon: Mail,
                                            label: 'Email Address',
                                            value: 'sijgeria@gmail.com',
                                            href: 'mailto:sijgeria@gmail.com',
                                            color: 'blue'
                                        },
                                        {
                                            icon: Phone,
                                            label: 'Phone Number',
                                            value: '+91 906 463 6298',
                                            href: 'tel:+919064636298',
                                            color: 'cyan'
                                        },
                                        {
                                            icon: MapPin,
                                            label: 'Our Location',
                                            value: 'Sijgeria, West Bengal, India',
                                            href: null,
                                            color: 'blue'
                                        }
                                    ].map((contact, index) => (
                                        <motion.div
                                            key={contact.label}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-5 p-4 rounded-2xl bg-background/50 border border-border/50 hover:border-blue-400/30 transition-all duration-300 group"
                                        >
                                            <div className={`p-3 rounded-xl bg-gradient-to-r from-${contact.color}-500/10 to-${contact.color === 'blue' ? 'cyan' : 'blue'}-500/10 text-${contact.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                                <contact.icon size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-text-secondary uppercase tracking-wider">{contact.label}</p>
                                                {contact.href ? (
                                                    <a href={contact.href} className="text-lg font-semibold text-text-primary hover:text-blue-400 transition-colors duration-300">
                                                        {contact.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-lg font-semibold text-text-primary">{contact.value}</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Response Time Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-2 border-blue-400/20 rounded-3xl p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <Zap className="w-8 h-8 text-blue-400" />
                                    <div>
                                        <h4 className="font-black text-text-primary text-lg">Quick Response</h4>
                                        <p className="text-text-secondary text-sm">We typically respond within 24 hours</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Enhanced Right Side - Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 lg:p-10 shadow-2xl"
                        >
                            <AnimatePresence>
                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-6"
                                        >
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <h3 className="text-2xl font-black text-text-primary mb-3">Message Sent!</h3>
                                        <p className="text-text-secondary text-lg">
                                            Thank you for reaching out. We'll get back to you shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <h2 className="text-3xl font-black text-text-primary mb-2">Send us a Message</h2>
                                        <p className="text-text-secondary mb-8 font-light">Fill out the form below and we'll respond promptly</p>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">
                                                    <User className="w-4 h-4 inline-block mr-2" />
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg focus:border-blue-400 focus:ring-0 transition-all duration-300"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">
                                                    <Mail className="w-4 h-4 inline-block mr-2" />
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg focus:border-blue-400 focus:ring-0 transition-all duration-300"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">
                                                    <Target className="w-4 h-4 inline-block mr-2" />
                                                    Subject
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg focus:border-blue-400 focus:ring-0 transition-all duration-300"
                                                    placeholder="What's this about?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-black text-text-secondary mb-3 uppercase tracking-wider">
                                                    <MessageCircle className="w-4 h-4 inline-block mr-2" />
                                                    Message
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows="6"
                                                    className="w-full bg-background border-2 border-border rounded-2xl p-4 text-lg focus:border-blue-400 focus:ring-0 transition-all duration-300 resize-none"
                                                    placeholder="Tell us how we can help you..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: loading ? 1 : 1.02 }}
                                            whileTap={{ scale: loading ? 1 : 0.98 }}
                                            className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black py-5 rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-lg mt-6"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin w-6 h-6" />
                                            ) : (
                                                <>
                                                    <Send size={20} />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
