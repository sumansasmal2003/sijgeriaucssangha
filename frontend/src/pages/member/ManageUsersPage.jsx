import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, ShieldOff, ShieldCheck, CheckCircle, XCircle, Mail, Phone, User, Zap, Target } from 'lucide-react';
import Modal from '../../components/Modal';
import { format } from 'date-fns';

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
            <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-secondary/3"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center relative z-10"
                >
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-text-secondary text-lg">Loading users...</p>
                </motion.div>
            </div>
        );
    }

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
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-3 mb-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <User className="w-4 h-4 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-wider">Manage Users</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-text-primary">User Management</h1>
                        <p className="text-text-secondary mt-2 text-lg">Manage user accounts and access permissions</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid gap-6"
                    >
                        {users.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onBlock={handleOpenModal}
                                onUnblock={handleUnblockUser}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleCloseModal} title={`Block User: ${selectedUser?.fullName}`}>
                {selectedUser && <BlockUserForm onSubmit={handleBlockUser} onCancel={handleCloseModal} />}
            </Modal>
        </>
    );
};

// Enhanced UserCard Component
const UserCard = ({ user, onBlock, onUnblock }) => {
    const isCurrentlyBlocked = user.isBlocked && new Date() < new Date(user.blockedUntil);

    return (
        <motion.div
            variants={fadeIn}
            className="group relative bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                        <img
                            className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/50 shadow-lg"
                            src={user.profileImage.url}
                            alt={user.fullName}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            isCurrentlyBlocked ? 'bg-red-500' : 'bg-green-500'
                        }`}>
                            {isCurrentlyBlocked ? (
                                <ShieldOff size={12} className="text-white" />
                            ) : (
                                <ShieldCheck size={12} className="text-white" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-text-primary mb-1">{user.fullName}</h3>
                        <div className="flex flex-wrap gap-4 text-text-secondary text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                <span className="font-medium">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-primary" />
                                <span className="font-medium">{user.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/30">
                    <div>
                        {isCurrentlyBlocked ? (
                            <div>
                                <span className="px-3 py-1 text-xs font-black rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                                    Blocked
                                </span>
                                <p className="text-xs text-text-secondary mt-1 font-medium">
                                    Until {format(new Date(user.blockedUntil), 'PP')}
                                </p>
                            </div>
                        ) : (
                            <span className="px-3 py-1 text-xs font-black rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                Active
                            </span>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {isCurrentlyBlocked ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onUnblock(user)}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-black px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <ShieldCheck size={16} />
                                <span>Unblock</span>
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onBlock(user)}
                                className="flex items-center gap-2 bg-gradient-to-r from-secondary to-red-500 text-white font-black px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <ShieldOff size={16} />
                                <span>Block</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Enhanced BlockUserForm Component
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="blockDurationInDays" className="block text-sm font-black text-text-secondary mb-2">Block Duration (in days)</label>
                <input
                    type="number"
                    id="blockDurationInDays"
                    value={blockDurationInDays}
                    onChange={(e) => setBlockDurationInDays(parseInt(e.target.value, 10))}
                    min="1"
                    className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300"
                />
            </div>
            <div>
                <label htmlFor="blockReason" className="block text-sm font-black text-text-secondary mb-2">Reason for Blocking</label>
                <textarea
                    id="blockReason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    required
                    rows="4"
                    placeholder="e.g., Violation of community guidelines..."
                    className="w-full bg-surface/50 border border-border/50 rounded-xl p-3 text-text-primary placeholder-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all duration-300 resize-vertical"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <motion.button
                    type="button"
                    onClick={onCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-surface/50 border border-border/50 text-text-primary font-black px-6 py-3 rounded-xl hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
                >
                    <XCircle size={18} />
                    <span>Cancel</span>
                </motion.button>
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-secondary to-red-500 text-white font-black px-6 py-3 rounded-xl hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    <span>{loading ? 'Blocking...' : 'Confirm Block'}</span>
                </motion.button>
            </div>
        </form>
    );
};

export default ManageUsersPage;
