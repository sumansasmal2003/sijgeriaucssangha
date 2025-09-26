import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Loader2, Edit, Trash2, Zap, Target, Sparkles, Megaphone, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../../components/Modal';

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
const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const ManageAnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

    const fetchAnnouncements = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/announcements/all');
            setAnnouncements(data.announcements);
        } catch (error) {
            toast.error("Failed to load announcements.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentAnnouncement({ title: '', content: '' });
        setShowModal(true);
    };

    const handleOpenEditModal = (announcement) => {
        setIsEditing(true);
        setCurrentAnnouncement(announcement);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentAnnouncement(null);
    };

    const handleSubmit = async (announcementData) => {
        try {
            if (isEditing) {
                await api.put(`/announcements/${currentAnnouncement._id}`, announcementData);
                toast.success('Announcement updated successfully!');
            } else {
                await api.post('/announcements/new', announcementData);
                toast.success('Announcement created successfully!');
            }
            fetchAnnouncements();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save announcement.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                await api.delete(`/announcements/${id}`);
                toast.success("Announcement deleted!");
                fetchAnnouncements();
            } catch (error) {
                toast.error("Failed to delete announcement.");
            }
        }
    };

    return (
        <>
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
                        className="flex justify-between items-center mb-8"
                    >
                        <div>
                            <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <Megaphone className="w-4 h-4 text-primary" />
                                <span className="text-sm font-black text-primary uppercase tracking-wider">Manage Announcements</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-text-primary">Community Announcements</h1>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleOpenCreateModal}
                            className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300"
                        >
                            <PlusCircle size={20} />
                            <span>New Announcement</span>
                        </motion.button>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid gap-6"
                        >
                            {announcements.map((item) => (
                                <motion.div
                                    key={item._id}
                                    variants={fadeIn}
                                    className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-6 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-text-primary mb-2">{item.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-text-secondary text-sm">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-primary" />
                                                    <span className="font-medium">{item.createdBy.firstName} {item.createdBy.lastName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-primary" />
                                                    <span className="font-medium">{format(new Date(item.createdAt), 'PP')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleOpenEditModal(item)}
                                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                                            >
                                                <Edit size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                    <p className="text-text-primary leading-relaxed">{item.content}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {announcements.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-border/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Megaphone size={40} className="text-border" />
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-3">No Announcements Yet</h3>
                            <p className="text-text-secondary mb-6 text-lg">Create your first announcement to share with the community.</p>
                            <button
                                onClick={handleOpenCreateModal}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300"
                            >
                                <PlusCircle size={20} />
                                <span>Create Announcement</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal} title={isEditing ? 'Edit Announcement' : 'Create Announcement'}>
                <AnnouncementForm announcement={currentAnnouncement} onSubmit={handleSubmit} onCancel={handleCloseModal} />
            </Modal>
        </>
    );
};

// Enhanced AnnouncementForm component
const AnnouncementForm = ({ announcement, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(announcement);
    const [formLoading, setFormLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        await onSubmit(formData);
        setFormLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-black text-text-secondary mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter announcement title"
                    className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                />
            </div>
            <div>
                <label className="block text-sm font-black text-text-secondary mb-2">Content</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Enter announcement content"
                    className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-vertical"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-surface/50 border border-border/50 text-text-primary font-black px-6 py-3 rounded-xl hover:border-primary/50 transition-all duration-300"
                >
                    Cancel
                </motion.button>
                <motion.button
                    type="submit"
                    disabled={formLoading}
                    whileHover={{ scale: formLoading ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary to-primary-hover text-white font-black px-6 py-3 rounded-xl hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center gap-3"
                >
                    {formLoading && <Loader2 className="animate-spin" size={18} />}
                    {formLoading ? 'Saving...' : 'Save Announcement'}
                </motion.button>
            </div>
        </form>
    );
};

export default ManageAnnouncementsPage;
