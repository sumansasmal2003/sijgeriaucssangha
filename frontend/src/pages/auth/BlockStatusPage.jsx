import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import Countdown from '../../components/Countdown';

// Animation variants matching homepage
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

const BlockStatusPage = () => {
    const location = useLocation();
    const { reason, until } = location.state || {
        reason: 'No reason provided.',
        until: new Date(Date.now() + 3600000)
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-500/3 to-cyan-500/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
                <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl animate-float delay-3000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="w-full max-w-lg text-center bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl p-8 relative z-10"
            >
                {/* Header with gradient */}
                <motion.div
                    variants={scaleIn}
                    className="mb-6 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <div className="relative inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                        <ShieldAlert className="h-16 w-16 text-red-400" />
                    </div>
                </motion.div>

                <motion.h1
                    variants={fadeIn}
                    className="text-4xl font-black tracking-tight mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
                >
                    Account Temporarily Suspended
                </motion.h1>

                <motion.p
                    variants={fadeIn}
                    className="text-text-secondary text-lg leading-relaxed mb-6"
                >
                    Your account has been temporarily suspended for the following reason:
                </motion.p>

                <motion.div
                    variants={fadeIn}
                    className="bg-background/50 p-6 rounded-2xl border border-border/50 mb-8 backdrop-blur-sm"
                >
                    <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                        <p className="text-text-primary text-left font-medium">{reason}</p>
                    </div>
                </motion.div>

                <motion.h2
                    variants={fadeIn}
                    className="text-xl font-black text-text-primary mb-6"
                >
                    Account will be automatically unlocked in:
                </motion.h2>

                <motion.div variants={fadeIn}>
                    <Countdown expiryDate={until} />
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    className="mt-8 pt-6 border-t border-border/30"
                >
                    <Link
                        to="/login"
                        className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-surface to-background border border-border hover:border-blue-400/50 text-text-primary font-semibold transition-all duration-300 hover:-translate-y-1"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login Page
                    </Link>
                </motion.div>

                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400/20 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400/20 rounded-full blur-sm animate-pulse delay-1000"></div>
            </motion.div>
        </div>
    );
};

export default BlockStatusPage;
