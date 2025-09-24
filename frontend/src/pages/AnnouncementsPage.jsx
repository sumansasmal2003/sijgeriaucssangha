import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { Loader2, Megaphone } from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/announcements/all');
                setAnnouncements(data.announcements);
            } catch (error) {
                toast.error("Failed to load announcements.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <Megaphone className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary">Notice Board</h1>
                <p className="mt-2 text-lg text-text-secondary">The latest news, updates, and announcements from the club.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {announcements.length > 0 ? (
                    announcements.map(item => (
                        <div key={item._id} className="bg-surface border border-border rounded-lg p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-text-primary">{item.title}</h2>
                                <span className="text-xs text-text-secondary whitespace-nowrap">{format(new Date(item.createdAt), 'PP')}</span>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">Posted by {item.createdBy.firstName} {item.createdBy.lastName}</p>
                            <p className="mt-4 text-text-primary whitespace-pre-wrap">{item.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-text-secondary">No announcements have been posted yet.</p>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
