
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { User, StaffMember, Affiliate } from '../../types';
import { Badge, Modal, Input, Button, Select, TextArea, DevNote } from '../../components/UIComponents';
import { Ban, Coins, MessageSquare, ShieldCheck, Save, Send } from 'lucide-react';

interface UsersManagerProps {
    subTab: string;
    users: User[];
    onUpdateUser: (u: User) => void;
}

export const UsersManager: React.FC<UsersManagerProps> = ({ subTab, users, onUpdateUser }) => {
    
    const [staff, setStaff] = useState<StaffMember[]>([
        { id: 'st1', username: 'AdminJohn', role: 'Admin', lastActive: 'Now' },
        { id: 'st2', username: 'ModSarah', role: 'Moderator', lastActive: '2h ago' }
    ]);

    const [affiliates, setAffiliates] = useState<Affiliate[]>([
        { id: 'af1', code: 'NINJA', user: 'NinjaUser', earnings: 500, referrals: 120 }
    ]);

    // User Edit Modal State
    const [editUserModal, setEditUserModal] = useState<User | null>(null);
    const [adminNotes, setAdminNotes] = useState('');
    
    // Direct Message State
    const [dmOpen, setDmOpen] = useState(false);
    const [dmMessage, setDmMessage] = useState('');

    if (subTab === 'USERS') {
        return (
            <>
                <DevNote title="GDPR & Security Protocols">
                    <strong>1. PII Encryption:</strong> Email addresses, real names, and IP addresses must be encrypted at rest (AES-256). <br/>
                    <strong>2. Banning Mechanism:</strong> Setting status to 'Banned' must invoke a `revoke_tokens(user_id)` function to kill all active JWT sessions immediately (Redis blacklist). <br/>
                    <strong>3. Data Deletion:</strong> If a user requests deletion, use soft-deletes for transactional integrity but anonymize PII fields (e.g. `email` becomes `deleted_user_123@swapy.gg`).
                </DevNote>
                <GenericModule<User>
                    title="User Management"
                    data={users}
                    columns={[
                        { key: 'username', label: 'Username' },
                        { key: 'role', label: 'Role', render: (u) => <Badge variant="outline">{u.role}</Badge> },
                        { key: 'status', label: 'Status', render: (u) => <Badge variant={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge> },
                        { key: 'walletBalance', label: 'Balance', render: (u) => `$${u.walletBalance.toFixed(2)}` },
                        { key: 'actions', label: 'Actions', render: (u) => <Button size="sm" variant="secondary" onClick={() => setEditUserModal(u)}>Manage</Button> }
                    ]}
                    fields={[]} 
                    onSave={() => {}} 
                    onDelete={() => {}}
                />
                
                <Modal isOpen={!!editUserModal} onClose={() => setEditUserModal(null)} title="Manage User">
                    {editUserModal && (
                        <div className="space-y-4">
                             <div className="flex items-center gap-4 p-4 bg-nexus-main border border-nexus-border rounded-lg">
                                 <img src={editUserModal.avatar} className="w-12 h-12 rounded-full" alt=""/>
                                 <div>
                                     <div className="font-bold text-white">{editUserModal.username}</div>
                                     <div className="text-xs text-gray-500">{editUserModal.id}</div>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                 <Select label="Role" value={editUserModal.role} onChange={e => setEditUserModal({...editUserModal, role: e.target.value as any})}>
                                     <option value="USER">User</option>
                                     <option value="SELLER">Seller</option>
                                     <option value="ADMIN">Admin</option>
                                 </Select>

                                 <Select label="Status" value={editUserModal.status} onChange={e => setEditUserModal({...editUserModal, status: e.target.value as any})}>
                                     <option value="Active">Active</option>
                                     <option value="Banned">Banned</option>
                                     <option value="Suspended">Suspended</option>
                                 </Select>
                             </div>

                             <Input label="Wallet Balance ($)" type="number" value={editUserModal.walletBalance} onChange={e => setEditUserModal({...editUserModal, walletBalance: parseFloat(e.target.value)})} />
                             <DevNote title="Audit Warning">
                                 Manual balance adjustments are logged. Any change here creates a `Manual Adjustment` transaction record automatically.
                             </DevNote>
                             
                             <TextArea label="Admin Internal Notes" placeholder="Add notes about this user..." value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} />

                             <div className="grid grid-cols-2 gap-2 pt-2">
                                <Button size="sm" variant="outline" icon={MessageSquare} onClick={() => setDmOpen(true)}>Direct Message</Button>
                                <Button size="sm" variant="outline" icon={ShieldCheck} onClick={() => setEditUserModal({...editUserModal, kycLevel: 'Gold'})}>Manual Verify (Gold)</Button>
                             </div>

                             <div className="flex justify-between pt-4 border-t border-nexus-border">
                                 <Button variant="danger" icon={Ban} onClick={() => { setEditUserModal({...editUserModal, status: 'Banned'}); }}>Ban User</Button>
                                 <Button icon={Save} onClick={() => { onUpdateUser(editUserModal); setEditUserModal(null); }}>Save Changes</Button>
                             </div>
                        </div>
                    )}
                </Modal>

                <Modal isOpen={dmOpen} onClose={() => setDmOpen(false)} title={`Message to ${editUserModal?.username}`}>
                    <div className="space-y-4">
                        <TextArea placeholder="Type your message..." value={dmMessage} onChange={e => setDmMessage(e.target.value)} rows={4} />
                        <div className="flex justify-end">
                            <Button icon={Send} onClick={() => { alert("Message sent!"); setDmOpen(false); setDmMessage(''); }}>Send Message</Button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }

    if (subTab === 'STAFF') {
        return (
            <>
                <DevNote title="RBAC (Role Based Access Control)">
                    <strong>Permissions Table:</strong> Staff users do not just have a 'Role'. They have a set of permissions (e.g. `can_edit_games`, `can_process_refunds`, `can_ban_users`). <br/>
                    <strong>Middleware:</strong> Implement an `@CheckPermission('can_edit_games')` decorator on API endpoints.
                </DevNote>
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
            </>
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
