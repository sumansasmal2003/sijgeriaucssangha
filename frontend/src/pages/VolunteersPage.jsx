import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users, Mail, Phone } from 'lucide-react';

const VolunteerCard = ({ user }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-lg text-center p-6 flex flex-col items-center"
        >
            <img
                src={user.profileImage.url}
                alt={user.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-primary/50 mb-4"
            />
            <h3 className="text-xl font-bold text-text-primary">{user.fullName}</h3>
            <div className="mt-4 border-t border-border/50 w-full pt-4 space-y-2">
                <a href={`mailto:${user.email}`} className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-primary">
                    <Mail size={14} /> {user.email}
                </a>
                <p className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                    <Phone size={14} /> {user.contactNumber}
                </p>
            </div>
        </motion.div>
    );
};

const VolunteersPage = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const { data } = await api.get('/user/volunteers');
                if (data.success) {
                    setVolunteers(data.users);
                }
            } catch (error) {
                toast.error('Could not fetch the list of volunteers.');
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <Users className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary">
                    Our Dedicated Volunteers
                </h1>
                <p className="mt-2 text-lg text-text-secondary max-w-2xl mx-auto">
                    The heart of our community. We are incredibly grateful for the time and effort our volunteers contribute.
                </p>
            </div>

            {volunteers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {volunteers.map(user => (
                        <VolunteerCard key={user._id} user={user} />
                    ))}
                </div>
            ) : (
                 <p className="text-center text-text-secondary">No volunteers to display at the moment.</p>
            )}
        </div>
    );
};

export default VolunteersPage;
