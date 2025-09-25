import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Loader2, Maximize, Calendar, User, Grid3X3, Zap, Sparkles, Filter, Image as ImageIcon } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import api from '../api/api';
import { Helmet } from 'react-helmet-async';


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
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [activeFilter, setActiveFilter] = useState('all');
    const [hoveredImage, setHoveredImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const { data } = await api.get('/gallery/all');
                setImages(data.images);
            } catch (error) {
                toast.error("Failed to load gallery images.");
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Group images by event or category if available
    const categories = [...new Set(images.map(img => img.category || 'General'))];
    const filteredImages = activeFilter === 'all'
        ? images
        : images.filter(img => img.category === activeFilter);

    const slides = filteredImages.map(img => ({
        src: img.image.url,
        title: img.title,
        description: img.description || `Uploaded by ${img.uploadedBy?.firstName || 'User'}`,
    }));

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-text-secondary text-lg font-medium">Loading gallery memories...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
        <Helmet>
                <title>Gallery - Sijgeria UCS Sangha</title>
                <meta name="description" content="A visual journey through our events, initiatives, and community gatherings. Each picture tells a story of unity, celebration, and progress." />
            </Helmet>
            <div className="min-h-screen bg-background overflow-hidden">
                {/* Enhanced Hero Section */}
                <section className="relative py-24 lg:py-32 bg-gradient-to-br from-surface/30 to-background overflow-hidden">
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
                            className="text-center max-w-5xl mx-auto"
                        >
                            {/* Header Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20"
                            >
                                <ImageIcon className="w-5 h-5 text-blue-400" />
                                <span className="text-sm font-black text-blue-400 uppercase tracking-wider">Photo Gallery</span>
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-text-primary mb-6">
                                Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Gallery</span>
                            </h1>
                            <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-3xl mx-auto font-light">
                                A visual journey through our events, initiatives, and community gatherings.
                                Each picture tells a story of unity, celebration, and progress.
                            </p>

                            {/* Enhanced Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-8 max-w-md mx-auto"
                            >
                                {[
                                    { value: images.length, label: 'Photos', color: 'from-blue-400 to-cyan-400' },
                                    { value: categories.length, label: 'Categories', color: 'from-cyan-400 to-blue-400' },
                                    { value: new Date().getFullYear(), label: 'Memories', color: 'from-blue-400 to-cyan-400' }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-center p-4 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm"
                                    >
                                        <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-text-secondary font-bold mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Enhanced Content Section */}
                <section className="relative py-20 lg:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Enhanced Filter Tabs */}
                        {categories.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-wrap gap-3 justify-center mb-16"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 relative group ${
                                        activeFilter === 'all'
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/25'
                                            : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border-2 border-border/50'
                                    }`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Filter size={16} />
                                        All Photos
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.button>

                                {categories.map(category => (
                                    <motion.button
                                        key={category}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveFilter(category)}
                                        className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 relative group ${
                                            activeFilter === category
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/25'
                                                : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border-2 border-border/50'
                                        }`}
                                    >
                                        <span className="relative z-10">{category}</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {/* Enhanced Gallery Grid */}
                        {filteredImages.length > 0 ? (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                            >
                                {filteredImages.map((image, index) => (
                                    <motion.div
                                        key={image._id}
                                        variants={scaleIn}
                                        className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer bg-surface/50 border-2 border-border/50 hover:border-blue-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                                        onMouseEnter={() => setHoveredImage(image._id)}
                                        onMouseLeave={() => setHoveredImage(null)}
                                        onClick={() => setLightboxIndex(index)}
                                    >
                                        {/* Image */}
                                        <motion.img
                                            src={image.image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            whileHover={{ scale: 1.1 }}
                                        />

                                        {/* Enhanced Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                                <h3 className="text-white font-black text-lg mb-2 line-clamp-2">
                                                    {image.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-gray-300 text-sm">
                                                    {image.uploadedBy && (
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-blue-400" />
                                                            <span className="font-medium">{image.uploadedBy.firstName}</span>
                                                        </div>
                                                    )}
                                                    {image.createdAt && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-cyan-400" />
                                                            <span className="font-medium">{new Date(image.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Enhanced Zoom Icon */}
                                            <motion.div
                                                className="absolute top-4 right-4 p-3 bg-black/70 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                <Maximize size={18} />
                                            </motion.div>

                                            {/* Enhanced Category Badge */}
                                            {image.category && (
                                                <motion.div
                                                    className="absolute top-4 left-4"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-black px-3 py-2 rounded-xl shadow-lg">
                                                        {image.category}
                                                    </span>
                                                </motion.div>
                                            )}

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Loading Animation */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: hoveredImage === image._id ? 1 : 0 }}
                                            className="absolute inset-0 border-2 border-transparent border-t-blue-400 border-r-cyan-400 rounded-3xl"
                                            transition={{ duration: 0.5 }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Grid3X3 className="w-32 h-32 text-border mx-auto mb-6" />
                                </motion.div>
                                <h3 className="text-3xl font-black text-text-primary mb-4">No images found</h3>
                                <p className="text-text-secondary text-lg max-w-md mx-auto mb-8">
                                    {activeFilter === 'all'
                                        ? "Our gallery is being prepared with amazing memories. Check back soon!"
                                        : `No images found in the ${activeFilter} category.`
                                    }
                                </p>
                                <Link
                                    to="/events"
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300"
                                >
                                    <Zap size={20} />
                                    Explore Upcoming Events
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>

            {/* Enhanced Lightbox */}
            <Lightbox
                open={lightboxIndex > -1}
                close={() => setLightboxIndex(-1)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Zoom]}
                styles={{
                    container: {
                        backgroundColor: '#ffffff',
                        backdropFilter: "blur(20px)"
                    },
                    captionsTitle: {
                        color: "#000",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        fontFamily: "inherit"
                    },
                    captionsDescription: {
                        color: "#000",
                        fontSize: "1rem",
                        fontFamily: "inherit"
                    }
                }}
                animation={{ fade: 500, swipe: 300 }}
            />
        </>
    );
};

export default GalleryPage;
