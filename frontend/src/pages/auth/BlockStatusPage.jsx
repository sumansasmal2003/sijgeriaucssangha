import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Countdown from '../../components/Countdown';

const BlockStatusPage = () => {
    const location = useLocation();
    const { reason, until } = location.state || { reason: 'No reason provided.', until: new Date() };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg text-center bg-surface border border-border rounded-xl shadow-lg p-8"
            >
                <ShieldAlert className="mx-auto h-16 w-16 text-secondary mb-4" />
                <h1 className="text-3xl font-bold text-text-primary">Account Blocked</h1>
                <p className="text-text-secondary mt-4 mb-6">Your account has been temporarily suspended for the following reason:</p>
                <div className="bg-background p-4 rounded-lg border border-border/50 text-text-primary mb-6">
                    <p>{reason}</p>
                </div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">Your account will be automatically unlocked in:</h2>

                <Countdown expiryDate={until} />

                <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    <ArrowLeft size={16} />
                    Back to Login Page
                </Link>
            </motion.div>
        </div>
    );
};

export default BlockStatusPage;
