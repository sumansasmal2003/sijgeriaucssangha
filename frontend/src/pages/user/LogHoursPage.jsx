import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Clock, BookText, Send, Loader2, ArrowLeft } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';
import { Link } from 'react-router-dom';

const LogHoursPage = () => {
    const navigate = useNavigate();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [formData, setFormData] = useState({
        eventId: '',
        hours: 1,
        description: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/event/user/my-events');
                if (data.success) {
                    // Map registrations to the format needed for the custom dropdown
                    const eventOptions = data.registrations.map(reg => ({
                        name: reg.eventTitle,
                        value: reg.eventId,
                    }));
                    setRegisteredEvents(eventOptions);
                }
            } catch (error) {
                toast.error("Could not load your registered events.");
            }
        };
        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEventChange = (value) => {
        setFormData({ ...formData, eventId: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.eventId) return toast.error("Please select an event.");
        if (formData.hours <= 0) return toast.error("Hours must be a positive number.");
        if (!formData.description.trim()) return toast.error("Please provide a description.");

        setLoading(true);
        try {
            await api.post('/volunteer/log-hours', {
                eventId: formData.eventId,
                hours: Number(formData.hours),
                description: formData.description,
            });
            toast.success("Hours submitted for review!");
            navigate('/user/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
            <div className="text-center mb-10">
                 <Clock className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary">
                    Log Your Volunteer Hours
                </h1>
                <p className="mt-2 text-lg text-text-secondary">
                    Thank you for your contribution. Please fill out the form below.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-lg p-8"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CustomDropdown
                        label="Select Event"
                        options={registeredEvents}
                        selected={formData.eventId}
                        setSelected={handleEventChange}
                    />

                    <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-text-secondary mb-2">Hours Volunteered</label>
                        <input
                            type="number"
                            name="hours"
                            id="hours"
                            value={formData.hours}
                            onChange={handleChange}
                            required
                            min="0.5"
                            step="0.5"
                            className="w-full bg-background border border-border rounded-lg p-2.5"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">Description of Task</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="e.g., Helped with event setup and registration desk..."
                            className="w-full bg-background border border-border rounded-lg p-2.5"
                        />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                         <Link to="/user/dashboard" className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                            <span>{loading ? 'Submitting...' : 'Submit for Review'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LogHoursPage;
