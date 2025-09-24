import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInSeconds } from 'date-fns';
import { Zap, Clock } from 'lucide-react';

const Countdown = ({ expiryDate, title = "Countdown" }) => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const totalSeconds = differenceInSeconds(expiry, now);

        if (totalSeconds <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        return { days, hours, minutes, seconds, expired: false };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft.expired) {
                clearInterval(timer);
            }
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    const timeUnits = [
        { value: timeLeft.days, label: 'Days', max: 365 },
        { value: timeLeft.hours, label: 'Hours', max: 24 },
        { value: timeLeft.minutes, label: 'Minutes', max: 60 },
        { value: timeLeft.seconds, label: 'Seconds', max: 60 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-surface to-background border border-border rounded-2xl p-6 shadow-lg"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                    <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-black text-text-primary">{title}</h3>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {timeUnits.map((unit, index) => (
                    <motion.div
                        key={unit.label}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                    >
                        <div className="bg-background/50 border border-border/50 rounded-xl p-4 text-center backdrop-blur-sm">
                            {/* Animated Number */}
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={unit.value}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl lg:text-3xl font-black text-text-primary block"
                                >
                                    {String(unit.value).padStart(2, '0')}
                                </motion.span>
                            </AnimatePresence>

                            {/* Label */}
                            <span className="text-xs text-text-secondary uppercase font-bold tracking-wider mt-2 block">
                                {unit.label}
                            </span>

                            {/* Progress Bar */}
                            <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(unit.value / unit.max) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                                />
                            </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                ))}
            </div>

            {/* Status Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: timeLeft.expired ? 1 : 0.7 }}
                className={`flex items-center justify-center gap-2 mt-4 p-2 rounded-lg ${
                    timeLeft.expired
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}
            >
                <Zap className={`w-4 h-4 ${timeLeft.expired ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-bold">
                    {timeLeft.expired ? 'Time Expired' : 'Counting Down...'}
                </span>
            </motion.div>
        </motion.div>
    );
};

export default Countdown;
