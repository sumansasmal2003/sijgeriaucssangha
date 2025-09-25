import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Heart, BookOpen, Sparkles, ArrowRight, Target, Eye, Handshake, Trophy, Star, Zap, Globe } from 'lucide-react';
import sucss from '../assets/sucss.png';

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

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const AboutPage = () => {
    return (
        <div className="bg-background text-text-primary overflow-x-hidden">
            {/* Enhanced Hero Section */}
            <section className="relative py-24 lg:py-32 text-center bg-gradient-to-br from-surface/50 to-background overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cyan-600/10 rounded-full blur-3xl animate-float delay-2000"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-surface/80"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="max-w-5xl mx-auto flex flex-col items-center"
                    >
                        {/* Enhanced Logo */}
                        <motion.div
                            variants={scaleIn}
                            className="mb-8 relative inline-block"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                            <img
                                src={sucss}
                                alt="Club Logo"
                                className='w-32 h-32 mx-auto rounded-2xl border-4 border-primary/20 shadow-2xl relative z-10 bg-surface/50 backdrop-blur-sm'
                            />
                        </motion.div>

                        {/* Header Badge */}
                        <motion.div
                            variants={fadeIn}
                            className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                        >
                            <Star className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-black text-blue-400 uppercase tracking-wider">Our Story</span>
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6"
                        >
                            About <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SUCSS</span>
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto font-light"
                        >
                            Discover the inspiring story behind our community, our unwavering mission,
                            and the core values that guide every initiative we undertake.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced Our Story Section */}
            <section className="relative py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={slideInLeft}
                            className="space-y-6"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black mb-6">Our Journey</h2>
                            <p className="text-xl text-text-secondary leading-relaxed font-light">
                                Founded with a vision to create a vibrant and supportive community,
                                <span className="text-blue-400 font-semibold"> Sijgeria Umesh Chandra Smriti Sangha </span>
                                began as a small group of passionate individuals united by a common goal:
                                to foster cultural heritage, support local youth, and drive positive social change.
                            </p>
                            <p className="text-xl text-text-secondary leading-relaxed font-light">
                                Over the years, we've evolved into a thriving organization, touching countless lives
                                through our diverse events and welfare programs. Our journey stands as a powerful
                                testament to the impact of collective action and shared commitment to community progress.
                            </p>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-6 mt-8"
                            >
                                {[
                                    { value: '10+', label: 'Years', color: 'blue' },
                                    { value: '200+', label: 'Members', color: 'cyan' },
                                    { value: '50+', label: 'Events', color: 'blue' }
                                ].map((stat, index) => (
                                    <div key={stat.label} className="text-center p-4 rounded-2xl bg-surface/50 border border-border/50">
                                        <div className={`text-2xl font-black bg-gradient-to-r from-${stat.color}-400 to-${stat.color === 'blue' ? 'cyan' : 'blue'}-400 bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-text-secondary font-bold mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={slideInRight}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-surface to-background rounded-3xl border-2 border-border/50 p-8 h-96 lg:h-[500px]">
                                {/* Placeholder for club image or collage */}
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 flex items-center justify-center">
                                    <div className="text-center">
                                        <Globe className="w-24 h-24 text-border mx-auto mb-4" />
                                        <p className="text-text-secondary font-light">Our Community in Action</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/10 rounded-2xl blur-xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-400/10 rounded-2xl blur-xl"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Mission & Vision Section */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-surface/50 to-background/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={fadeIn}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                                    <Target className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-3xl font-black">Our Mission</h3>
                            </div>
                            <p className="text-xl text-text-secondary leading-relaxed font-light">
                                To empower our community through innovative social, cultural, and educational
                                initiatives that create meaningful opportunities, foster unity, and inspire
                                a brighter, more prosperous future for every member.
                            </p>
                        </motion.div>

                        <motion.div
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.5 }}
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                                    <Eye className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-3xl font-black">Our Vision</h3>
                            </div>
                            <p className="text-xl text-text-secondary leading-relaxed font-light">
                                We envision a self-reliant, culturally rich, and progressive community where
                                every individual has access to the support, resources, and opportunities needed
                                to achieve their fullest potential and contribute to collective growth.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Our Values Section */}
            <section className="relative py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        {/* Header Badge */}
                        <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            <Heart className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm font-black text-cyan-400 uppercase tracking-wider">Our Values</span>
                        </div>

                        <h2 className="text-4xl lg:text-5xl font-black mb-12">The Principles We Live By</h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                    >
                        <EnhancedValueCard
                            icon={Users}
                            title="Community First"
                            description="We believe in the transformative power of unity and collective effort towards common goals."
                            color="blue"
                        />
                        <EnhancedValueCard
                            icon={Handshake}
                            title="Integrity"
                            description="We operate with unwavering transparency, honesty, and respect in all our interactions."
                            color="cyan"
                        />
                        <EnhancedValueCard
                            icon={Sparkles}
                            title="Innovation"
                            description="We continuously seek creative, forward-thinking solutions to better serve our community."
                            color="blue"
                        />
                        <EnhancedValueCard
                            icon={BookOpen}
                            title="Education"
                            description="We champion lifelong learning and knowledge sharing as pillars of community growth."
                            color="cyan"
                        />
                        <EnhancedValueCard
                            icon={Trophy}
                            title="Excellence"
                            description="We strive for the highest standards in every initiative and program we undertake."
                            color="blue"
                        />
                        <EnhancedValueCard
                            icon={Zap}
                            title="Action-Oriented"
                            description="We believe in turning ideas into tangible results that benefit our community."
                            color="cyan"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-surface/80 to-background/80">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">Meet Our Leadership Team</h2>
                        <p className="text-xl text-text-secondary mb-10 font-light leading-relaxed">
                            Our club is guided by a team of dedicated leaders who bring passion, expertise,
                            and vision to drive our mission forward. Get to know the people behind our success.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/our-team"
                                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black px-10 py-5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 text-lg"
                            >
                                <Users size={24} />
                                <span>Meet Our Team</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const EnhancedValueCard = ({ icon: Icon, title, description, color }) => (
    <motion.div
        variants={scaleIn}
        className="group relative bg-gradient-to-br from-surface to-background p-8 rounded-3xl border-2 border-border/50 hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2"
    >
        <div className="text-center">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r from-${color}-500/10 to-${color === 'blue' ? 'cyan' : 'blue'}-500/10 text-${color}-400 group-hover:scale-110 transition-transform duration-300 mb-6`}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-text-primary mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                {title}
            </h3>
            <p className="text-text-secondary leading-relaxed font-light">{description}</p>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </motion.div>
);

export default AboutPage;
