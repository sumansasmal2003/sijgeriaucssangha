import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../../components/Modal';

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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">Manage Announcements</h1>
                    <button onClick={handleOpenCreateModal} className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                        <PlusCircle size={20} />
                        <span>New Announcement</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
                ) : (
                    <div className="bg-surface border border-border rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-background">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Created By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {announcements.map((item) => (
                                    <tr key={item._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{item.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{item.createdBy.firstName} {item.createdBy.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{format(new Date(item.createdAt), 'PP')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => handleOpenEditModal(item)} className="text-primary hover:text-primary-hover"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="text-secondary hover:text-secondary/80"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal} title={isEditing ? 'Edit Announcement' : 'Create Announcement'}>
                <AnnouncementForm announcement={currentAnnouncement} onSubmit={handleSubmit} onCancel={handleCloseModal} />
            </Modal>
        </>
    );
};

// Sub-component for the form to keep things clean
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required rows="6" className="w-full bg-background border border-border rounded-lg p-2" />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-background border border-border text-text-primary font-semibold px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" disabled={formLoading} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
                    {formLoading && <Loader2 className="animate-spin" size={18} />}
                    {formLoading ? 'Saving...' : 'Save Announcement'}
                </button>
            </div>
        </form>
    );
};

export default ManageAnnouncementsPage;
