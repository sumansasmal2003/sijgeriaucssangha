import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { Loader2, Users } from 'lucide-react';

const MemberCard = ({ member }) => {
    return (
        <div className="bg-surface border border-border rounded-lg text-center p-6 flex flex-col items-center">
          {member.profileImage ? (
              <img
                  src={member.profileImage.url}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/50 mb-4"
              />
          ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-primary/50 mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
              </div>
          )}
            <h3 className="text-lg font-bold text-text-primary">{member.firstName} {member.lastName}</h3>
            <p className="text-sm text-text-primary font-semibold">{member.designation}</p>
            <p className="text-sm text-text-secondary font-semibold">{member.phone}</p>
            <p className="text-sm text-text-secondary font-semibold">{member.email}</p>
        </div>
    );
};

const MemberDirectoryPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/member/directory');
            setMembers(data.members);
        } catch (error) {
            toast.error('Could not fetch member directory.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <Users className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary">
                    Member Directory
                </h1>
                <p className="mt-2 text-lg text-text-secondary">
                    Meet the dedicated members of our community.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map(member => (
                    <MemberCard key={member._id} member={member} />
                ))}
            </div>
        </div>
    );
};

export default MemberDirectoryPage;
