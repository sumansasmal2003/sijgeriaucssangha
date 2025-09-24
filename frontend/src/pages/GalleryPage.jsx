import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2, Maximize, Calendar, User, Grid3X3 } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import api from '../api/api';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [activeFilter, setActiveFilter] = useState('all');

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
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-surface/50 to-background">
                    <div className="absolute inset-0 opacity-[0.02]">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, #F8F8F8 1px, transparent 0)`,
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary mb-6">
                                Our <span className="text-primary">Gallery</span>
                            </h1>
                            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                                A visual journey through our events, initiatives, and community gatherings.
                                Each picture tells a story of unity, celebration, and progress.
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{images.length}</div>
                                    <div className="text-sm text-text-secondary">Photos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">{categories.length}</div>
                                    <div className="text-sm text-text-secondary">Categories</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-text-primary">{new Date().getFullYear()}</div>
                                    <div className="text-sm text-text-secondary">Memories</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Filter Tabs */}
                        {categories.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-wrap gap-3 justify-center mb-12"
                            >
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                                        activeFilter === 'all'
                                            ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25'
                                            : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50'
                                    }`}
                                >
                                    All Photos
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveFilter(category)}
                                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                                            activeFilter === category
                                                ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25'
                                                : 'bg-surface/50 text-text-secondary hover:text-primary hover:bg-surface border border-border/50'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {/* Gallery Grid */}
                        {filteredImages.length > 0 ? (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            >
                                {filteredImages.map((image, index) => (
                                    <motion.div
                                        key={image._id}
                                        variants={fadeIn}
                                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-surface/50 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                                        onClick={() => setLightboxIndex(index)}
                                    >
                                        <img
                                            src={image.image.url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                                                    {image.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-gray-300 text-xs">
                                                    {image.uploadedBy && (
                                                        <div className="flex items-center gap-1">
                                                            <User size={12} />
                                                            <span>{image.uploadedBy.firstName}</span>
                                                        </div>
                                                    )}
                                                    {image.createdAt && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Zoom Icon */}
                                            <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                                <Maximize size={16} />
                                            </div>

                                            {/* Category Badge */}
                                            {image.category && (
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                        {image.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <Grid3X3 className="w-24 h-24 text-border mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-text-primary mb-2">No images found</h3>
                                <p className="text-text-secondary max-w-md mx-auto">
                                    {activeFilter === 'all'
                                        ? "Our gallery is being prepared. Check back soon for amazing photos!"
                                        : `No images found in the ${activeFilter} category.`
                                    }
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={lightboxIndex > -1}
                close={() => setLightboxIndex(-1)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Zoom]}
                styles={{
                    container: { backgroundColor: "rgba(12, 12, 13, 0.95)" },
                    captionsTitle: { color: "#F8F8F8", fontSize: "1.25rem" },
                    captionsDescription: { color: "#A1A1AA" }
                }}
            />
        </>
    );
};

export default GalleryPage;
