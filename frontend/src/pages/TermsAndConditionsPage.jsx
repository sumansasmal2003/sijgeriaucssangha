import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Users, Calendar, Gift, Shield, AlertCircle, Mail, BookOpen } from 'lucide-react';
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

const TermsAndConditionsPage = () => {
    const currentYear = new Date().getFullYear();

    const termsSections = [
        {
            icon: Users,
            title: "1. User Accounts and Conduct",
            content: "To access certain features, you must register for a User (Volunteer) account. You agree to provide accurate, current, and complete information during the registration process.",
            details: [
                "You are responsible for safeguarding your password and for all activities under your account",
                "You agree not to engage in harmful, abusive, or disruptive activities",
                "We reserve the right to suspend or terminate accounts that violate our policies"
            ]
        },
        {
            icon: Shield,
            title: "2. Member Responsibilities",
            content: "Members have additional privileges including event management and user administration capabilities.",
            details: [
                "Act in the best interest of the club and its community",
                "Misuse of privileges may result in revocation of member status",
                "Maintain confidentiality and respect for all community members"
            ]
        },
        {
            icon: Calendar,
            title: "3. Event Participation",
            content: "When you register for an event, you agree to provide accurate information for all performers.",
            details: [
                "Cancellations are permitted up until the day before the event",
                "Same-day cancellations are not permitted",
                "The club reserves the right to cancel or reschedule events"
            ]
        },
        {
            icon: Gift,
            title: "4. Donations",
            content: "All donations are processed via UPI QR code system with complete transparency.",
            details: [
                "We record name, email, and donation amount for records",
                "Transactions are handled by your UPI application and banking network",
                "All donations are final and non-refundable"
            ]
        },
        {
            icon: BookOpen,
            title: "5. Intellectual Property",
            content: "All content on this website is protected by intellectual property laws.",
            details: [
                "Content includes text, graphics, logos, and images",
                "Reproduction or distribution requires express written permission",
                "Respect copyright and trademark protections"
            ]
        },
        {
            icon: AlertCircle,
            title: "6. Limitation of Liability",
            content: "This website and its content are provided on an 'as is' basis.",
            details: [
                "We make no warranties, expressed or implied",
                "Not liable for damages arising from use of the website",
                "Use the website at your own discretion and risk"
            ]
        },
        {
            icon: FileText,
            title: "7. Changes to These Terms",
            content: "We reserve the right to modify these Terms and Conditions at any time.",
            details: [
                "Changes will be posted on this page with updated dates",
                "Continued use constitutes acceptance of new terms",
                "Review this page periodically for updates"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
          <Helmet>
                <title>Terms & Conditions - Sijgeria UCS Sangha</title>
                <meta name="description" content="These terms govern your use of our website and services. Please read them carefully." />
            </Helmet>
            {/* Enhanced Hero Section */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-surface/30 to-background">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
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
                            className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                        >
                            <FileText className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm font-black text-cyan-400 uppercase tracking-wider">Terms of Service</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                            Terms & <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Conditions</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-light">
                            Welcome to our community. These terms govern your use of our website and services.
                            Please read them carefully.
                        </p>

                        {/* Last Updated */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-border/50 inline-block"
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
                        initial="initial"
                        animate="animate"
                        variants={{
                            animate: {
                                transition: {
                                    staggerChildren: 0.15
                                }
                            }
                        }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        {/* Introduction */}
                        <motion.div variants={fadeIn} className="text-center mb-12">
                            <p className="text-lg text-text-secondary leading-relaxed font-light">
                                Welcome to the Sijgeria Umesh Chandra Smriti Sangha website.
                                By accessing or using our website, you agree to be bound by these
                                Terms and Conditions and our Privacy Policy.
                            </p>
                        </motion.div>

                        {/* Terms Sections */}
                        {termsSections.map((section, index) => (
                            <motion.section
                                key={index}
                                variants={scaleIn}
                                className="bg-gradient-to-br from-surface to-background border-2 border-border/50 rounded-3xl p-8 lg:p-10 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                                        <section.icon className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl lg:text-3xl font-black text-text-primary mb-3">
                                            {section.title}
                                        </h2>
                                        <p className="text-lg text-text-secondary font-light mb-4">
                                            {section.content}
                                        </p>
                                        <ul className="space-y-2">
                                            {section.details.map((detail, detailIndex) => (
                                                <li key={detailIndex} className="flex items-start gap-3 text-text-secondary">
                                                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                                    <span className="font-light leading-relaxed">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.section>
                        ))}

                        {/* Contact Section */}
                        <motion.section variants={fadeIn} className="text-center bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border-2 border-cyan-400/20 rounded-3xl p-8 mt-12">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Mail className="w-8 h-8 text-cyan-400" />
                                <h2 className="text-2xl lg:text-3xl font-black text-text-primary">Contact Us</h2>
                            </div>
                            <p className="text-text-secondary text-lg mb-6 font-light">
                                If you have any questions about these Terms and Conditions, we're here to help.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300"
                            >
                                <Mail size={20} />
                                <span>Contact Our Team</span>
                            </Link>
                        </motion.section>

                        {/* Related Links */}
                        <motion.div variants={fadeIn} className="text-center border-t-2 border-border/50 pt-12 mt-12">
                            <p className="text-text-secondary mb-6 font-light">Related Documents</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/privacy" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border-2 border-border/50 hover:border-cyan-400/30 transition-all duration-300">
                                    <Shield size={18} />
                                    <span className="font-semibold">Privacy Policy</span>
                                </Link>
                                <Link to="/about" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all duration-300">
                                    <Users size={18} />
                                    <span>About Us</span>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditionsPage;
