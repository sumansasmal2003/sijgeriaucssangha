import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Sparkles, Heart, Zap, ArrowRight } from 'lucide-react';
import sucss from '../assets/sucss.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-surface to-background border-t border-border/50 overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float delay-2000"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-10 lg:gap-12">
          {/* Enhanced Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-1">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="w-14 h-14 rounded-2xl bg-surface border-2 border-border flex items-center justify-center relative z-10">
                  <img src={sucss} alt="SUCSS Logo" className='w-10 h-10' />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-text-primary to-text-primary bg-clip-text text-transparent">
                  Sijgeria UCS Sangha
                </span>
                <p className="text-sm text-text-secondary mt-2 font-medium">Community • Culture • Progress</p>
              </div>
            </Link>
            <p className="text-text-secondary text-lg leading-relaxed max-w-md mb-8 font-light">
              Empowering our community through social welfare, cultural preservation, and youth development initiatives.
              Together, we build a brighter future.
            </p>

            {/* Enhanced Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: FaFacebook, href: "#", label: "Facebook", color: "blue" },
                { icon: FaInstagram, href: "#", label: "Instagram", color: "pink" },
                { icon: FaTwitter, href: "#", label: "Twitter", color: "sky" },
                { icon: FaYoutube, href: "#", label: "YouTube", color: "red" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href}
                  className="p-3 rounded-xl bg-background/50 border border-border/50 text-text-secondary hover:text-primary hover:border-primary/50 hover:shadow-lg transition-all duration-300 group relative"
                  aria-label={social.label}
                >
                  <social.icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-black text-text-primary mb-8 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Events', path: '/events' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link, index) => (
                <li key={link.name}>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-primary transition-all duration-300 inline-block group font-medium"
                    >
                      <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="group-hover:underline">{link.name}</span>
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Get Involved */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-black text-text-primary mb-8 relative inline-block">
              Get Involved
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Become a Member', path: '/register' },
                { name: 'Volunteer', path: '/volunteer' },
                { name: 'Donate', path: '/donate' },
                { name: 'Events Calendar', path: '/events' },
                { name: 'Member Login', path: '/login' }
              ].map((link) => (
                <li key={link.name}>
                  <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link
                      to={link.path}
                      className="text-text-secondary hover:text-primary transition-all duration-300 inline-block group font-medium"
                    >
                      <span className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <Zap className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="group-hover:underline">{link.name}</span>
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-black text-text-primary mb-8 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></span>
            </h3>
            <div className="space-y-6">
              {[
                { icon: FaMapMarkerAlt, text: 'Sijgeria, West Bengal, India', href: null },
                { icon: FaEnvelope, text: 'sijgeria@gmail.com', href: 'mailto:sijgeria@gmail.com' },
                { icon: FaPhone, text: '+91 906 463 6298', href: 'tel:+919064636298' }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 text-text-secondary group transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300">
                    <contact.icon size={16} />
                  </div>
                  {contact.href ? (
                    <a href={contact.href} className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                      {contact.text}
                    </a>
                  ) : (
                    <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                      {contact.text}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Bottom Bar */}
        <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="text-text-secondary text-sm text-center lg:text-left font-medium">
              © {currentYear} Sijgeria Umesh Chandra Smriti Sangha. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-text-secondary text-sm">
              <Link to="/privacy" className="hover:text-primary transition-colors duration-300 font-medium">Privacy Policy</Link>
              <div className="w-1 h-1 bg-border rounded-full"></div>
              <Link to="/terms" className="hover:text-primary transition-colors duration-300 font-medium">Terms of Service</Link>
              <div className="w-1 h-1 bg-border rounded-full"></div>
              <span className="flex items-center gap-2 font-medium">
                Made with <Heart size={14} className="text-red-400 animate-pulse" /> by our community
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
