import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Users } from 'lucide-react';

const OfficialCard = ({ member }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-lg text-center p-8 flex flex-col items-center"
        >
            <img
                src={member.profileImage.url}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary mb-4"
            />
            <h3 className="text-xl font-bold text-text-primary">{member.firstName} {member.lastName}</h3>
            <p className="text-md text-text-primary font-semibold">{member.designation}</p>
            <p className="text-md text-text-secondary font-semibold">{member.phone}</p>
            <p className="text-md text-shadow-text-secondary font-semibold">{member.email}</p>
        </motion.div>
    );
};

const OurTeamPage = () => {
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficials = async () => {
            try {
                const { data } = await api.get('/member/public-directory');
                setOfficials(data.officials);
            } catch (error) {
                toast.error('Could not fetch team directory.');
            } finally {
                setLoading(false);
            }
        };
        fetchOfficials();
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
                    Our Team
                </h1>
                <p className="mt-2 text-lg text-text-secondary max-w-2xl mx-auto">
                    Meet the dedicated leadership team guiding our club's mission and activities.
                </p>
            </div>

            {officials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {officials.map(member => (
                        <OfficialCard key={member._id} member={member} />
                    ))}
                </div>
            ) : (
                 <p className="text-center text-text-secondary">The leadership directory is currently unavailable.</p>
            )}
        </div>
    );
};

export default OurTeamPage;
