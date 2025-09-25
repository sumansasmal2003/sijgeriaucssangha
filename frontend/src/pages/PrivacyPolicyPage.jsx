import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Enhanced Animation Variants
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const PrivacyPolicyPage = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-background overflow-hidden">
          <Helmet>
                <title>Privacy Policy - Sijgeria UCS Sangha</title>
                <meta name="description" content="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information." />
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
                            <ShieldCheck className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-black text-blue-400 uppercase tracking-wider">Privacy & Security</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                            Privacy <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Policy</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-light">
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>

                        {/* Last Updated */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-border/50 inline-block"
                        >
                            <p className="text-text-secondary font-medium">
                                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Content Section */}
            <section className="relative py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="max-w-4xl mx-auto space-y-12"
                    >
                        {/* Introduction */}
                        <motion.div variants={fadeIn} className="text-center">
                            <p className="text-lg text-text-secondary leading-relaxed font-light">
                                Sijgeria Umesh Chandra Smriti Sangha ("we," "our," or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                            </p>
                        </motion.div>

                        {/* Policy Sections */}
                        {[
                            {
                                icon: UserCheck,
                                title: "1. Information We Collect",
                                content: "We may collect personal information from you in a variety of ways, including:",
                                points: [
                                    "Personal Data: When you register as a User (Volunteer) or are invited as a Member, we collect personally identifiable information, such as your name, email address, and phone number, which you voluntarily give to us.",
                                    "Donation Information: When you make a donation, we collect your name and email to record the transaction. We do not collect or store any payment card information.",
                                    "Event Participation Data: When you register for an event, we collect your contact details and the names of the performers you register."
                                ]
                            },
                            {
                                icon: Eye,
                                title: "2. How We Use Your Information",
                                content: "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience:",
                                points: [
                                    "Create and manage your account",
                                    "Email you regarding your account, event registrations, or donations",
                                    "Process donations and send you confirmation",
                                    "Organize and manage club events",
                                    "Notify you of updates, announcements, and new events"
                                ]
                            },
                            {
                                icon: Lock,
                                title: "3. Disclosure of Your Information",
                                content: "We do not share, sell, rent, or trade your personal information with any third parties for their commercial purposes:",
                                points: [
                                    "Public Directories: Club officials' information may be displayed on our team page. Volunteers' information may be displayed on our volunteers page.",
                                    "By Law or to Protect Rights: If release of information is necessary to respond to legal process or to protect rights."
                                ]
                            },
                            {
                                icon: ShieldCheck,
                                title: "4. Security of Your Information",
                                content: "We use administrative, technical, and physical security measures to help protect your personal information.",
                                points: [
                                    "While we have taken reasonable steps to secure your information, no security measures are perfect.",
                                    "We continuously monitor and update our security practices to protect your data."
                                ]
                            }
                        ].map((section, index) => (
                            <motion.section key={index} variants={scaleIn} className="bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 lg:p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                                        <section.icon className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-text-primary mb-3">{section.title}</h2>
                                        <p className="text-lg text-text-secondary font-light">{section.content}</p>
                                    </div>
                                </div>
                                <ul className="space-y-3 ml-4">
                                    {section.points.map((point, pointIndex) => (
                                        <li key={pointIndex} className="flex items-start gap-3 text-text-secondary">
                                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="font-light leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>
                        ))}

                        {/* Contact Section */}
                        <motion.section variants={fadeIn} className="text-center bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-2 border-blue-400/20 rounded-3xl p-8">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Mail className="w-8 h-8 text-blue-400" />
                                <h2 className="text-3xl font-black text-text-primary">Contact Us</h2>
                            </div>
                            <p className="text-text-secondary text-lg mb-4 font-light">
                                If you have questions or comments about this Privacy Policy, please contact us at:
                            </p>
                            <div className="space-y-2">
                                <p className="text-text-primary font-semibold">Sijgeria Umesh Chandra Smriti Sangha</p>
                                <a href="mailto:sijgeria@gmail.com" className="text-blue-400 hover:text-blue-300 font-medium text-lg transition-colors duration-300">
                                    sijgeria@gmail.com
                                </a>
                            </div>
                        </motion.section>

                        {/* Related Links */}
                        <motion.div variants={fadeIn} className="text-center border-t-2 border-border/50 pt-12">
                            <p className="text-text-secondary mb-6 font-light">Related Documents</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/terms" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border-2 border-border/50 hover:border-blue-400/30 transition-all duration-300">
                                    <FileText size={18} />
                                    <span className="font-semibold">Terms & Conditions</span>
                                </Link>
                                <Link to="/contact" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all duration-300">
                                    <Mail size={18} />
                                    <span>Contact Us</span>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
