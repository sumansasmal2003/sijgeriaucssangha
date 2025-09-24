import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HandHeart, Users, Trophy, Lightbulb, ArrowRight, BookOpen, Sparkles, Quote, MapPin, Star, Zap, Heart, Target } from 'lucide-react';
import sucss from '../assets/sucss.png';
import Map from '../components/Map';

// --- Enhanced Animation Variants ---
const fadeIn = {
    initial: { opacity: 0, y: 40 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1
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

// --- Enhanced Animated Counter Component ---
const AnimatedCounter = ({ from, to, label, colorClass = 'text-primary', icon: Icon }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });

    useEffect(() => {
        if (inView) {
            const node = ref.current;
            const controls = animate(from, to, {
                duration: 2.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                onUpdate(value) {
                    node.textContent = Math.round(value).toLocaleString();
                }
            });
            return () => controls.stop();
        }
    }, [inView, from, to]);

    return (
        <motion.div
            variants={scaleIn}
            className="relative group text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-background border border-border hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
                {Icon && (
                    <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <p className={`text-4xl sm:text-5xl font-bold tabular-nums ${colorClass} drop-shadow-sm`} ref={ref}>
                    {from.toLocaleString()}
                </p>
                <p className="mt-3 text-sm sm:text-base text-text-secondary tracking-wide font-medium">{label}</p>
            </div>
        </motion.div>
    );
};

// --- Main Enhanced HomePage Component ---
const HomePage = () => {
  const clubLocation = [22.50214407049836, 87.66240195892591];
  const impactRef = useRef(null);
  const impactInView = useInView(impactRef, { once: true, amount: 0.3 });

  return (
    <div className="overflow-x-hidden bg-background min-h-screen text-text-primary">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-500/3 to-cyan-500/3"></div>
            {/* Floating shapes */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float delay-2000"></div>
            <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl animate-float delay-3000"></div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="max-w-6xl mx-auto"
            >
                {/* Enhanced Logo */}
                <motion.div
                    variants={scaleIn}
                    className="mb-8 relative inline-block"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <img
                        src={sucss}
                        alt="SUCSS Logo"
                        className='w-32 h-32 mx-auto rounded-full border-4 border-primary/20 shadow-2xl relative z-10 bg-surface/50 backdrop-blur-sm'
                    />
                </motion.div>

                {/* Enhanced Title */}
                <motion.h1
                    variants={fadeIn}
                    className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6"
                >
                    Forge a{' '}
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Brighter
                        </span>
                        <div className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </span>
                    <br />
                    Future with{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Community
                    </span>
                </motion.h1>

                {/* Enhanced Description */}
                <motion.p
                    variants={fadeIn}
                    className="mt-8 max-w-4xl mx-auto text-xl sm:text-2xl text-text-secondary leading-relaxed font-light"
                >
                    Join the Sijgeria Umesh Chandra Smriti Sangha in our mission to drive{' '}
                    <span className="text-blue-400 font-medium">social change</span>, celebrate our rich{' '}
                    <span className="text-cyan-400 font-medium">culture</span>, and empower the next generation through{' '}
                    <span className="text-blue-400 font-medium">meaningful initiatives</span>.
                </motion.p>

                {/* Enhanced CTA Buttons */}
                <motion.div
                    variants={fadeIn}
                    className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6"
                >
                    <Link
                        to="/register"
                        className="group relative flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center">
                            Get Involved
                            <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                        </span>
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
                    </Link>

                    <Link
                        to="/about"
                        className="group relative flex items-center justify-center border-2 border-border text-text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:border-cyan-400/50 hover:bg-surface/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1"
                    >
                        <span className="relative z-10 flex items-center">
                            Learn More
                            <Target className="w-5 h-5 ml-3 text-cyan-400" />
                        </span>
                    </Link>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-20 flex justify-center"
                >
                    <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1 h-3 bg-blue-400 rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Enhanced Initiatives Section */}
      <section className="relative py-24 lg:py-32 bg-surface/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-surface/30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-20"
          >
            <motion.div
              variants={scaleIn}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
            >
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Our Initiatives</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Creating <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Lasting Impact</span>
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-text-secondary leading-relaxed">
              We focus on key areas to create meaningful, sustainable change in our community through targeted initiatives.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            <EnhancedFeatureCard
              icon={<HandHeart />}
              title="Social Welfare"
              description="Supporting the underprivileged through health camps, donation drives, and essential aid programs."
              delay={0}
            />
            <EnhancedFeatureCard
              icon={<Sparkles />}
              title="Cultural Enrichment"
              description="Celebrating our heritage with vibrant festivals and events that unite our community."
              delay={0.1}
            />
            <EnhancedFeatureCard
              icon={<Trophy />}
              title="Youth & Sports"
              description="Promoting teamwork and well-being via sports tournaments and youth engagement programs."
              delay={0.2}
            />
            <EnhancedFeatureCard
              icon={<BookOpen />}
              title="Education For All"
              description="Building a brighter future by supporting students with workshops and educational resources."
              delay={0.3}
            />
            <EnhancedFeatureCard
              icon={<Users />}
              title="Community Building"
              description="Creating a strong, interconnected community through collaborative projects and forums."
              delay={0.4}
            />
            <EnhancedFeatureCard
              icon={<Lightbulb />}
              title="New Horizons"
              description="Exploring innovative ways to address community needs and drive positive change."
              delay={0.5}
            />
          </motion.div>
        </div>
      </section>

      {/* Enhanced Location Section */}
      <section className="relative py-24 lg:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface/20 to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center mb-20"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                >
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Visit Us</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                    Find Us <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Here</span>
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-text-secondary">
                    Visit us at our physical location to be a part of our community activities and events.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center"
            >
                <motion.div
                    variants={slideInLeft}
                    className="lg:col-span-2 h-96 lg:h-[500px] rounded-3xl overflow-hidden border-2 border-border shadow-2xl relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 z-10 pointer-events-none"></div>
                    <Map position={clubLocation} locationName="Sijgeria UCS Sangha" />
                </motion.div>

                <motion.div
                    variants={slideInRight}
                    className="bg-surface p-10 rounded-3xl border border-border shadow-2xl text-center lg:text-left backdrop-blur-sm"
                >
                    <div className="inline-flex items-center justify-center lg:justify-start gap-3 mb-6 p-3 rounded-2xl bg-cyan-500/10">
                        <MapPin className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="text-3xl font-black text-text-primary mb-4">Our Clubhouse</h3>
                    <p className="text-text-secondary text-lg leading-relaxed mb-6">
                        Sijgeria, Debra, Paschim Medinipur, West Bengal, India
                    </p>
                    <a
                        href={`https://www.google.com/maps?q=${clubLocation[0]},${clubLocation[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Get Directions
                        <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Enhanced Impact Section */}
      <section ref={impactRef} className="relative py-24 lg:py-32 bg-surface/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-center mb-20"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                >
                    <Star className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Our Impact</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                    Making a <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Real Difference</span>
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-text-secondary">
                    We are proud of the tangible difference we've made, thanks to our dedicated members and volunteers.
                </p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            >
                <AnimatedCounter
                    from={0}
                    to={50}
                    label="Events Hosted"
                    colorClass="text-blue-400"
                    icon={Star}
                />
                <AnimatedCounter
                    from={0}
                    to={200}
                    label="Active Volunteers"
                    colorClass="text-cyan-400"
                    icon={Users}
                />
                <AnimatedCounter
                    from={0}
                    to={1500}
                    label="Lives Touched"
                    colorClass="text-blue-400"
                    icon={Heart}
                />
                <AnimatedCounter
                    from={0}
                    to={10}
                    label="Years of Service"
                    colorClass="text-cyan-400"
                    icon={Trophy}
                />
            </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative py-24 lg:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface/10 to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-center mb-20"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20"
                >
                    <Quote className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Testimonials</span>
                </motion.div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                    Voices from Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Community</span>
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-text-secondary">
                    Hear what our members, volunteers, and beneficiaries have to say about their experience.
                </p>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
            >
                <EnhancedTestimonialCard
                    quote="Being a part of this Sangha has been a life-changing experience. The sense of community and shared purpose is truly inspiring."
                    name="Aarav Sharma"
                    role="Volunteer"
                    delay={0}
                />
                <EnhancedTestimonialCard
                    quote="The cultural events organized by the club help us stay connected to our roots and pass on our traditions to the next generation."
                    name="Priya Das"
                    role="Community Member"
                    delay={0.1}
                />
                <EnhancedTestimonialCard
                    quote="I'm grateful for the educational support my children received through the club's initiatives. It has opened up new opportunities."
                    name="Ramesh Gupta"
                    role="Beneficiary"
                    delay={0.2}
                />
            </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-surface/60 to-blue-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                >
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Join Us Today</span>
                </motion.div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-8">
                    Ready to Make a <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Difference</span>?
                </h2>

                <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
                    Join our community today and be part of something meaningful. Together, we can create lasting change and build a better future for everyone.
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link
                        to="/register"
                        className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center">
                            Join Us Now
                            <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                        </span>
                        <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-300"></div>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
      </section>
    </div>
  );
};

// Enhanced Feature Card Component
const EnhancedFeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    variants={fadeIn}
    custom={delay}
    className="group relative bg-surface p-10 rounded-3xl border border-border hover:border-blue-400/40 transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 blur-sm transition-opacity duration-500"></div>

    <div className="relative z-10">
      <div className="mb-8 inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <h3 className="text-2xl font-black text-text-primary mb-4 group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
      <p className="text-text-secondary leading-relaxed text-lg">{description}</p>
    </div>
  </motion.div>
);

// Enhanced Testimonial Card Component
const EnhancedTestimonialCard = ({ quote, name, role, delay = 0 }) => (
    <motion.div
        variants={fadeIn}
        custom={delay}
        className="group relative bg-surface p-10 rounded-3xl border border-border hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-xl"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 to-blue-500/3 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
            <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10">
                <Quote className="w-8 h-8 text-cyan-400 opacity-60" />
            </div>
            <p className="text-text-primary text-xl leading-relaxed mb-8 font-light italic relative">
                "{quote}"
                <div className="absolute -top-2 -left-2 text-6xl text-cyan-400/10 font-serif">"</div>
            </p>
            <div className="border-t border-border/30 pt-6">
                <p className="font-black text-text-primary text-lg">{name}</p>
                <p className="text-text-secondary font-medium">{role}</p>
            </div>
        </div>
    </motion.div>
);

export default HomePage;
