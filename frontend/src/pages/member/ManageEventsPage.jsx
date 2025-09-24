import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { PlusCircle, Edit, Trash2, Loader2, Users, Calendar, MapPin } from 'lucide-react';
import Modal from '../../components/Modal';
import { format } from 'date-fns';
import CustomDropdown from '../../components/CustomDropdown';

const ManageEventsPage = () => {
    const { member } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/event/all'); // Corrected URL
            const memberEvents = data.events.filter(event => event.createdBy === member._id);
            setEvents(memberEvents);
        } catch (error) {
            toast.error('Could not fetch your events.');
        } finally {
            setLoading(false);
        }
    }, [member._id]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentEvent({ title: '', description: '', date: '', location: '', eventType: 'GENERAL', bannerImage: null });
        setShowModal(true);
    };

    const handleOpenEditModal = (event) => {
        setIsEditing(true);
        const formattedEvent = { ...event, date: new Date(event.date).toISOString().split('T')[0] };
        setCurrentEvent(formattedEvent);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent(null);
    };

    const handleSubmit = async (eventData) => {
        const formData = new FormData();
        Object.keys(eventData).forEach(key => {
            if (key === 'bannerImage' && eventData[key] instanceof File) {
                formData.append(key, eventData[key]);
            } else if (key !== 'bannerImage' && eventData[key] !== null) {
                formData.append(key, eventData[key]);
            }
        });

        try {
            if (isEditing) {
                // --- FIX: Use the correct URL '/events/' (plural) ---
                await api.put(`/event/${currentEvent._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Event updated successfully!');
            } else {
                // --- FIX: Use the correct URL '/events/' (plural) ---
                await api.post('/event/new', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Event created successfully!');
            }
            fetchEvents();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save event.');
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/event/${eventId}`); // Corrected URL
                setEvents(events.filter(event => event._id !== eventId));
                toast.success('Event deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete event.');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Manage Events</h1>
                        <p className="text-text-secondary mt-1">Create, edit, and track your club events.</p>
                    </div>
                    <button onClick={handleOpenCreateModal} className="flex items-center justify-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto">
                        <PlusCircle size={20} />
                        <span>Create Event</span>
                    </button>
                </div>

                {/* --- DESKTOP TABLE VIEW --- */}
                <div className="hidden md:block bg-surface border border-border rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {events.length > 0 ? events.map((event) => (
                                <EventTableRow key={event._id} event={event} onEdit={handleOpenEditModal} onDelete={handleDelete} />
                            )) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-sm text-text-secondary">You haven't created any events yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- MOBILE CARD VIEW --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                     {events.length > 0 ? events.map((event) => (
                        <EventCard key={event._id} event={event} onEdit={handleOpenEditModal} onDelete={handleDelete} />
                    )) : (
                        <p className="text-center text-text-secondary col-span-full">You haven't created any events yet.</p>
                    )}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal} title={isEditing ? 'Edit Event' : 'Create New Event'}>
                <EventForm event={currentEvent} onSubmit={handleSubmit} onCancel={handleCloseModal} />
            </Modal>
        </>
    );
};

// --- Sub-components for different views ---

const EventTableRow = ({ event, onEdit, onDelete }) => (
    <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{event.title}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{format(new Date(event.date), 'PP')}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.eventType === 'PARTICIPATION' ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-300'}`}>{event.eventType}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-end items-center gap-4">
            {event.eventType === 'PARTICIPATION' && (
                <Link to={`/member/events/participants/${event._id}`} className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors">
                    <Users size={16} /><span className="text-xs font-bold">Participants</span>
                </Link>
            )}
            <button onClick={() => onEdit(event)} className="text-primary hover:text-primary-hover transition-colors"><Edit size={18} /></button>
            <button onClick={() => onDelete(event._id)} className="text-secondary hover:text-secondary/80 transition-colors"><Trash2 size={18} /></button>
        </td>
    </tr>
);

const EventCard = ({ event, onEdit, onDelete }) => (
    <div className="bg-surface border border-border rounded-lg shadow-md flex flex-col">
        <div className="p-4">
            <h3 className="font-bold text-text-primary">{event.title}</h3>
            <p className="text-sm text-text-secondary flex items-center gap-2 mt-1"><Calendar size={14}/> {format(new Date(event.date), 'PP')}</p>
            <p className="text-sm text-text-secondary flex items-center gap-2"><MapPin size={14}/> {event.location}</p>
            <span className={`mt-2 px-2 py-1 text-xs font-semibold rounded-full inline-block ${event.eventType === 'PARTICIPATION' ? 'bg-blue-900 text-blue-200' : 'bg-gray-700 text-gray-300'}`}>{event.eventType}</span>
        </div>
        <div className="border-t border-border mt-auto p-3 flex justify-end items-center gap-4 bg-background/50">
            {event.eventType === 'PARTICIPATION' && (
                <Link to={`/member/events/participants/${event._id}`} className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors mr-auto">
                    <Users size={16} /><span className="text-xs font-bold">Participants</span>
                </Link>
            )}
            <button onClick={() => onEdit(event)} className="text-primary hover:text-primary-hover transition-colors"><Edit size={20} /></button>
            <button onClick={() => onDelete(event._id)} className="text-secondary hover:text-secondary/80 transition-colors"><Trash2 size={20} /></button>
        </div>
    </div>
);

const EventForm = ({ event, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(event);
    const [formLoading, setFormLoading] = useState(false);

    const eventTypeOptions = [
        { name: 'General', value: 'GENERAL' },
        { name: 'Participation Based', value: 'PARTICIPATION' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, bannerImage: e.target.files[0] }));
    };

    const handleEventTypeChange = (value) => {
        setFormData(prev => ({ ...prev, eventType: value }));
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
                <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full bg-background border border-border rounded-lg p-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
            </div>

            {/* --- REPLACEMENT: Use the new CustomDropdown component --- */}
            <CustomDropdown
                label="Event Type"
                options={eventTypeOptions}
                selected={formData.eventType}
                setSelected={handleEventTypeChange}
            />

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Banner Image</label>
                <input type="file" name="bannerImage" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-background border border-border text-text-primary font-semibold px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" disabled={formLoading} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
                    {formLoading && <Loader2 className="animate-spin" size={18}/>}
                    {formLoading ? 'Saving...' : 'Save Event'}
                </button>
            </div>
        </form>
    );
};

export default ManageEventsPage;
