
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { User, StaffMember, Affiliate } from '../../types';
import { Badge } from '../../components/UIComponents';

interface UsersModuleProps {
    subTab: string;
    users: User[];
    onUpdateUser: (u: User) => void;
}

export const UsersModule: React.FC<UsersModuleProps> = ({ subTab, users, onUpdateUser }) => {
    
    const [staff, setStaff] = useState<StaffMember[]>([
        { id: 'st1', username: 'AdminJohn', role: 'Admin', lastActive: 'Now' },
        { id: 'st2', username: 'ModSarah', role: 'Moderator', lastActive: '2h ago' }
    ]);

    const [affiliates, setAffiliates] = useState<Affiliate[]>([
        { id: 'af1', code: 'NINJA', user: 'NinjaUser', earnings: 500, referrals: 120 }
    ]);

    if (subTab === 'USERS') {
        return (
            <GenericModule<User>
                title="User Management"
                data={users}
                columns={[
                    { key: 'username', label: 'Username' },
                    { key: 'role', label: 'Role', render: (u) => <Badge variant="outline">{u.role}</Badge> },
                    { key: 'status', label: 'Status', render: (u) => <Badge variant={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge> },
                    { key: 'walletBalance', label: 'Balance' }
                ]}
                fields={[
                    { key: 'role', label: 'Role', type: 'select', options: ['USER', 'SELLER', 'ADMIN'] },
                    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Banned', 'Suspended'] },
                    { key: 'walletBalance', label: 'Balance', type: 'number' }
                ]}
                onSave={onUpdateUser}
                onDelete={() => {}}
            />
        );
    }

    if (subTab === 'STAFF') {
        return (
            <GenericModule<StaffMember>
                title="Staff Management"
                data={staff}
                columns={[
                    { key: 'username', label: 'Username' },
                    { key: 'role', label: 'Role' },
                    { key: 'lastActive', label: 'Last Active' }
                ]}
                fields={[
                    { key: 'username', label: 'Username', type: 'text' },
                    { key: 'role', label: 'Role', type: 'select', options: ['Admin', 'Moderator', 'Support'] }
                ]}
                onSave={(item) => {
                     if(staff.find(i => i.id === item.id)) setStaff(staff.map(i => i.id === item.id ? item : i));
                     else setStaff([...staff, item]);
                }}
                onDelete={(id) => setStaff(staff.filter(s => s.id !== id))}
            />
        );
    }

    if (subTab === 'AFFILIATES') {
        return (
            <GenericModule<Affiliate>
                title="Affiliates"
                data={affiliates}
                columns={[
                    { key: 'code', label: 'Code' },
                    { key: 'user', label: 'User' },
                    { key: 'referrals', label: 'Referrals' },
                    { key: 'earnings', label: 'Earnings ($)' }
                ]}
                fields={[
                    { key: 'code', label: 'Referral Code', type: 'text' },
                    { key: 'user', label: 'Username', type: 'text' }
                ]}
                onSave={(item) => {
                     if(affiliates.find(i => i.id === item.id)) setAffiliates(affiliates.map(i => i.id === item.id ? item : i));
                     else setAffiliates([...affiliates, item]);
                }}
                onDelete={(id) => setAffiliates(affiliates.filter(s => s.id !== id))}
            />
        );
    }

    return <div>Select Users Module</div>;
};
