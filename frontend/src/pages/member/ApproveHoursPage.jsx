import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { Loader2, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';

const ApproveHoursPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingLogs = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/volunteer/pending-logs');
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            toast.error("Could not fetch pending logs.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingLogs();
    }, [fetchPendingLogs]);

    const handleUpdateStatus = async (logId, status) => {
        try {
            await api.put(`/volunteer/log/${logId}`, { status });
            toast.success(`Log has been ${status.toLowerCase()}.`);
            // Refresh the list by removing the approved/rejected item
            setLogs(prevLogs => prevLogs.filter(log => log._id !== logId));
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <Clock className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary">
                    Approve Volunteer Hours
                </h1>
                <p className="mt-2 text-lg text-text-secondary max-w-2xl mx-auto">
                    Review and approve hours submitted by volunteers to recognize their contributions.
                </p>
            </div>

            {logs.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-4">
                    {logs.map(log => (
                        <div key={log._id} className="bg-surface border border-border rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="flex items-center gap-4">
                                    <img src={log.user.profileImage.url} alt={log.user.fullName} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="font-bold text-text-primary">{log.user.fullName}</p>
                                        <p className="text-sm text-text-secondary">{log.event.title}</p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-primary mt-2 sm:mt-0">{log.hours} Hours</p>
                            </div>
                            <p className="text-sm text-text-secondary mt-3 italic bg-background p-3 rounded-md">"{log.description}"</p>
                            <div className="flex justify-end gap-4 mt-4">
                                <button onClick={() => handleUpdateStatus(log._id, 'Rejected')} className="flex items-center gap-2 text-sm font-semibold bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20">
                                    <X size={16}/> Reject
                                </button>
                                <button onClick={() => handleUpdateStatus(log._id, 'Approved')} className="flex items-center gap-2 text-sm font-semibold bg-green-500/10 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/20">
                                    <Check size={16}/> Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-text-secondary py-10">There are no pending volunteer hours to review.</p>
            )}
        </div>
    );
};

export default ApproveHoursPage;
