import React, { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send, Loader2, Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-bold text-text-primary"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary"
                    >
                        We'd love to hear from you. Whether you have a question, feedback, or a proposal, feel free to reach out.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    {/* Left Side - Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-surface border border-border rounded-xl p-8 space-y-6"
                    >
                        <h2 className="text-2xl font-semibold text-text-primary">Contact Information</h2>
                        <p className="text-text-secondary">Our team is available to assist you. Find our contact details below.</p>
                        <div className="border-t border-border pt-6 space-y-4">
                            <div className="flex items-center gap-4"><Mail className="w-6 h-6 text-primary" /> <a href="mailto:sijgeria@gmail.com" className="text-text-primary hover:underline">sijgeria@gmail.com</a></div>
                            <div className="flex items-center gap-4"><Phone className="w-6 h-6 text-primary" /> <span className="text-text-primary">+91 12345 67890</span></div>
                            <div className="flex items-start gap-4"><MapPin className="w-6 h-6 text-primary mt-1" /> <span className="text-text-primary">Sijgeria, West Bengal, India</span></div>
                        </div>
                    </motion.div>

                    {/* Right Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-surface border border-border rounded-xl p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Subject</label>
                                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full bg-background border border-border rounded-lg p-3"></textarea>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-3 px-6 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
                            >
                                {loading ? <><Loader2 className="animate-spin" /><span>Sending...</span></> : <><Send size={18} /><span>Send Message</span></>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
