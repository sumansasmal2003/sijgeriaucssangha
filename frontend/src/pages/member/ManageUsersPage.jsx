import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldOff, ShieldCheck, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import Modal from '../../components/Modal';
import { format } from 'date-fns';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/user/all');
            setUsers(data.users);
        } catch (error) {
            toast.error('Could not fetch users.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleBlockUser = async ({ blockReason, blockDurationInDays }) => {
        try {
            await api.put(`/user/block/${selectedUser._id}`, { blockReason, blockDurationInDays });
            toast.success(`User ${selectedUser.fullName} has been blocked.`);
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to block user.');
        }
    };

    const handleUnblockUser = async (user) => {
        if (window.confirm(`Are you sure you want to unblock ${user.fullName}?`)) {
            try {
                await api.put(`/user/unblock/${user._id}`);
                toast.success(`User ${user.fullName} has been unblocked.`);
                fetchUsers();
            } catch (error) {
                toast.error('Failed to unblock user.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-text-primary mb-8">Manage Users</h1>

                {/* --- DESKTOP TABLE VIEW (Hidden on mobile) --- */}
                <div className="hidden md:block bg-surface border border-border rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <UserTableRow
                                    key={user._id}
                                    user={user}
                                    onBlock={handleOpenModal}
                                    onUnblock={handleUnblockUser}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- MOBILE CARD VIEW (Hidden on desktop) --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                    {users.map((user) => (
                        <UserCard
                            key={user._id}
                            user={user}
                            onBlock={handleOpenModal}
                            onUnblock={handleUnblockUser}
                        />
                    ))}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal} title={`Block User: ${selectedUser?.fullName}`}>
                {selectedUser && <BlockUserForm onSubmit={handleBlockUser} onCancel={handleCloseModal} />}
            </Modal>
        </>
    );
};

// Sub-component for the Desktop Table Row
const UserTableRow = ({ user, onBlock, onUnblock }) => {
    const isCurrentlyBlocked = user.isBlocked && new Date() < new Date(user.blockedUntil);
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={user.profileImage.url} alt={user.fullName} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-text-primary">{user.fullName}</div>
                        <div className="text-sm text-text-secondary">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isCurrentlyBlocked ? (
                    <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">Blocked</span>
                        <p className="text-xs text-text-secondary mt-1">Until {format(new Date(user.blockedUntil), 'PP')}</p>
                    </div>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">Active</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.contactNumber}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {isCurrentlyBlocked ? (
                    <button onClick={() => onUnblock(user)} className="flex items-center gap-2 ml-auto bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors">
                        <ShieldCheck size={16} /><span>Unblock</span>
                    </button>
                ) : (
                    <button onClick={() => onBlock(user)} className="flex items-center gap-2 ml-auto bg-secondary text-white font-semibold px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-colors">
                        <ShieldOff size={16} /><span>Block</span>
                    </button>
                )}
            </td>
        </tr>
    );
};

// Sub-component for the Mobile Card View
const UserCard = ({ user, onBlock, onUnblock }) => {
    const isCurrentlyBlocked = user.isBlocked && new Date() < new Date(user.blockedUntil);
    return (
        <div className="bg-surface border border-border rounded-lg shadow-md p-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <img className="h-12 w-12 rounded-full object-cover" src={user.profileImage.url} alt={user.fullName} />
                <div className="flex-1">
                    <p className="text-md font-bold text-text-primary">{user.fullName}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1.5"><Mail size={12}/>{user.email}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1.5"><Phone size={12}/>{user.contactNumber}</p>
                </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
                {isCurrentlyBlocked ? (
                    <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">Blocked</span>
                        <p className="text-xs text-text-secondary mt-1">Until {format(new Date(user.blockedUntil), 'PP')}</p>
                    </div>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">Active</span>
                )}

                {isCurrentlyBlocked ? (
                    <button onClick={() => onUnblock(user)} className="flex items-center gap-2 bg-green-600 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm">
                        <ShieldCheck size={16} /><span>Unblock</span>
                    </button>
                ) : (
                    <button onClick={() => onBlock(user)} className="flex items-center gap-2 bg-secondary text-white font-semibold px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-colors text-sm">
                        <ShieldOff size={16} /><span>Block</span>
                    </button>
                )}
            </div>
        </div>
    );
};


// Sub-component for the Block User Form Modal
const BlockUserForm = ({ onSubmit, onCancel }) => {
    const [blockReason, setBlockReason] = useState('');
    const [blockDurationInDays, setBlockDurationInDays] = useState(7);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!blockReason.trim()) {
            return toast.error("A reason is required to block a user.");
        }
        if (blockDurationInDays <= 0) {
            return toast.error("Duration must be at least 1 day.");
        }
        setLoading(true);
        await onSubmit({ blockReason, blockDurationInDays });
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="blockDurationInDays" className="block text-sm font-medium text-text-secondary mb-1">Block Duration (in days)</label>
                <input
                    type="number"
                    id="blockDurationInDays"
                    value={blockDurationInDays}
                    onChange={(e) => setBlockDurationInDays(parseInt(e.target.value, 10))}
                    min="1"
                    className="w-full bg-background border border-border rounded-lg p-2"
                />
            </div>
            <div>
                <label htmlFor="blockReason" className="block text-sm font-medium text-text-secondary mb-1">Reason for Blocking</label>
                <textarea
                    id="blockReason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    required
                    rows="4"
                    placeholder="e.g., Violation of community guidelines..."
                    className="w-full bg-background border border-border rounded-lg p-2"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-background border border-border text-text-primary font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <XCircle size={18} /><span>Cancel</span>
                </button>
                <button type="submit" disabled={loading} className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg hover:bg-secondary/80 disabled:opacity-50 flex items-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    <span>{loading ? 'Blocking...' : 'Confirm Block'}</span>
                </button>
            </div>
        </form>
    );
};

export default ManageUsersPage;
