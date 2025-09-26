import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UploadCloud, Trash2, Loader2, Image as ImageIcon, Zap, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Animation variants
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

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const ManageGalleryPage = () => {
    const { member } = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newImage, setNewImage] = useState({ title: '', image: null });

    const fetchImages = useCallback(async () => {
        try {
            const { data } = await api.get('/gallery/all');
            setImages(data.images);
        } catch (error) {
            toast.error('Could not fetch gallery images.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleFileChange = (e) => {
        setNewImage({ ...newImage, image: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newImage.title || !newImage.image) {
            return toast.error('Please provide a title and select an image.');
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('title', newImage.title);
        formData.append('image', newImage.image);

        try {
            await api.post('/gallery/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Image uploaded successfully!');
            document.getElementById('image-upload-form').reset();
            setNewImage({ title: '', image: null });
            await fetchImages();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await api.delete(`/gallery/delete/${imageId}`);
                setImages(images.filter(img => img._id !== imageId));
                toast.success('Image deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete image.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Enhanced background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-black text-primary uppercase tracking-wider">Manage Gallery</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-text-primary">Community Gallery</h1>
                    <p className="text-text-secondary mt-2 text-lg">Share and manage community memories</p>
                </motion.div>

                {/* Enhanced Upload Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 mb-12 shadow-lg"
                >
                    <form onSubmit={handleUpload} id="image-upload-form" className="space-y-6">
                        <h2 className="text-xl font-black text-text-primary flex items-center gap-3">
                            <PlusCircle size={24} className="text-primary" />
                            Upload New Image
                        </h2>
                        <div>
                            <label htmlFor="title" className="block text-sm font-black text-text-secondary mb-2">Image Title</label>
                            <input
                                type="text"
                                id="title"
                                value={newImage.title}
                                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                                className="w-full bg-surface/50 border border-border/50 rounded-xl px-4 py-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                                placeholder="e.g., Annual Function 2024"
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-black text-text-secondary mb-2">Image File</label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-text-secondary file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:font-black file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: uploading ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={uploading}
                            className="flex items-center justify-center gap-3 w-full sm:w-auto bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        </motion.button>
                    </form>
                </motion.div>

                {/* Enhanced Image Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl font-black text-text-primary mb-6 flex items-center gap-3">
                        <ImageIcon size={24} className="text-primary" />
                        Uploaded Images
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {images.map((img) => (
                                <GalleryImageCard
                                    key={img._id}
                                    image={img}
                                    onDelete={handleDelete}
                                    canDelete={member._id === img.uploadedBy._id}
                                />
                            ))}
                        </motion.div>
                    )}

                    {images.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ImageIcon size={40} className="text-border" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-3">No Images Yet</h3>
                            <p className="text-text-secondary mb-6 text-lg">Upload the first image to start building your gallery.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// Enhanced GalleryImageCard Component
const GalleryImageCard = ({ image, onDelete, canDelete }) => {
    return (
        <motion.div
            variants={fadeIn}
            className="group relative bg-surface/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-xl"
        >
            <div className="relative overflow-hidden">
                <img
                    src={image.image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {canDelete && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(image._id)}
                        className="absolute top-3 right-3 bg-red-600/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                    >
                        <Trash2 size={16} />
                    </motion.button>
                )}
            </div>
            <div className="p-4">
                <p className="text-sm font-black text-text-primary truncate mb-1">{image.title}</p>
                <p className="text-xs text-text-secondary">By: {image.uploadedBy.firstName}</p>
            </div>
        </motion.div>
    );
};

export default ManageGalleryPage;
