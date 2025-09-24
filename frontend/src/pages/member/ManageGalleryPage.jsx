import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { UploadCloud, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
            await fetchImages(); // Refresh the list
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-text-primary mb-8">Manage Gallery</h1>

            {/* --- Upload Form --- */}
            <div className="bg-surface border border-border rounded-lg p-6 mb-12">
                <form onSubmit={handleUpload} id="image-upload-form" className="space-y-4">
                    <h2 className="text-xl font-semibold text-text-primary">Upload New Image</h2>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">Image Title</label>
                        <input
                            type="text"
                            id="title"
                            value={newImage.title}
                            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-primary focus:border-primary"
                            placeholder="e.g., Annual Function 2024"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-text-secondary mb-2">Image File</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
                        <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                </form>
            </div>

            {/* --- Image Grid --- */}
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Uploaded Images</h2>
            {loading ? (
                 <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img._id} className="relative group bg-surface rounded-lg overflow-hidden border border-border">
                            <img src={img.image.url} alt={img.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <p className="text-sm font-semibold text-text-primary truncate">{img.title}</p>
                                <p className="text-xs text-text-secondary">By: {img.uploadedBy.firstName}</p>
                            </div>
                            {member._id === img.uploadedBy._id && (
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="absolute top-2 right-2 bg-red-600/80 text-white p-2 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {images.length === 0 && <p className="text-text-secondary">No images have been uploaded yet.</p>}
                </div>
            )}
        </div>
    );
};

export default ManageGalleryPage;
