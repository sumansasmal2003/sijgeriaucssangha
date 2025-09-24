import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Heart, BookOpen, Sparkles, ArrowRight, Target, Eye, Handshake } from 'lucide-react';
import sucss from '../assets/sucss.png';

const fadeIn = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
};

const AboutPage = () => {
    return (
        <div className="bg-background text-text-primary overflow-x-hidden">
            {/* --- Hero Section --- */}
            <section className="relative py-24 sm:py-32 text-center bg-surface/50">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-surface/80"></div>
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cyan-600/5 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial="initial" animate="animate" variants={fadeIn}>
                        <img src={sucss} alt="Club Logo" className="w-24 h-24 mx-auto rounded-full border-4 border-primary/20 shadow-lg mb-6" />
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">About Sijgeria UCS Sangha</h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-text-secondary leading-relaxed">
                            Discover the story behind our community, our unwavering mission, and the values that guide every step we take.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Our Story Section --- */}
            <section className="py-20 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Story</h2>
                            <p className="text-lg text-text-secondary leading-relaxed mb-4">
                                Founded with a vision to create a vibrant and supportive community, Sijgeria Umesh Chandra Smriti Sangha began as a small group of passionate individuals. Our goal was simple: to foster cultural heritage, support local youth, and provide a platform for positive social change.
                            </p>
                            <p className="text-lg text-text-secondary leading-relaxed">
                                Over the years, we've grown into a thriving organization, touching countless lives through our diverse events and welfare programs. Our journey is a testament to the power of collective action and a shared commitment to progress.
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="h-80 bg-surface rounded-2xl border border-border p-4">
                            {/* Placeholder for an image of the club or a collage */}
                            <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                                <img src={sucss} alt="SUCSS" className='w-64' />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- Mission & Vision Section --- */}
            <section className="py-20 sm:py-24 bg-surface/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
                        <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-primary/10 rounded-md"><Target className="w-5 h-5 text-primary"/></div><h3 className="text-2xl font-bold">Our Mission</h3></div>
                        <p className="text-text-secondary leading-relaxed">To empower our community through social, cultural, and educational initiatives that create opportunities, foster unity, and inspire a brighter future for all.</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1 }}>
                        <div className="flex items-center gap-3 mb-3"><div className="p-2 bg-secondary/10 rounded-md"><Eye className="w-5 h-5 text-secondary"/></div><h3 className="text-2xl font-bold">Our Vision</h3></div>
                        <p className="text-text-secondary leading-relaxed">We envision a self-reliant, culturally rich, and progressive community where every individual has the support and resources to achieve their full potential.</p>
                    </motion.div>
                </div>
            </section>

            {/* --- Our Values Section --- */}
            <section className="py-20 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-12">The Values We Uphold</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <ValueCard icon={Users} title="Community" description="We believe in the power of unity and collective effort." />
                        <ValueCard icon={Handshake} title="Integrity" description="We operate with transparency, honesty, and respect for all." />
                        <ValueCard icon={Sparkles} title="Innovation" description="We continuously seek creative solutions to serve our community better." />
                    </div>
                </div>
            </section>

            {/* --- Meet The Team CTA --- */}
            <section className="py-20 sm:py-24 bg-surface/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet Our Leadership</h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">Our club is guided by a team of dedicated leaders who are passionate about our mission.</p>
                        <Link to="/our-team" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                            View Our Team <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const ValueCard = ({ icon: Icon, title, description }) => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }} className="p-6 bg-surface rounded-xl border border-border">
        <div className="inline-flex p-3 bg-primary/10 text-primary rounded-lg mb-4">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </motion.div>
);

export default AboutPage;
