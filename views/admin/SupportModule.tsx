
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { Ticket, KYCRequest, Review, Dispute } from '../../types';
import { Badge } from '../../components/UIComponents';

export const SupportModule: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    const [tickets, setTickets] = useState<Ticket[]>([
        { id: 't1', userId: 'u1', subject: 'Login Issue', type: 'Technical', status: 'Open', priority: 'High', createdAt: '2025-10-25', lastUpdate: 'Now' }
    ]);
    const [kyc, setKyc] = useState<KYCRequest[]>([
        { id: 'k1', userId: 'u5', username: 'NewSeller', type: 'Passport', status: 'Pending', submittedAt: '2025-10-24', images: [] }
    ]);
    const [disputes, setDisputes] = useState<Dispute[]>([
        { id: 'd1', orderId: 'ord_55', buyer: 'BuyerX', seller: 'SellerY', reason: 'Not delivered', status: 'Open', createdAt: '2025-10-20' }
    ]);
    const [reviews, setReviews] = useState<Review[]>([
        { id: 'r1', author: 'User1', rating: 'Positive', text: 'Great!', date: '2025-10-10', itemName: 'Gold', status: 'Approved' }
    ]);
    const [gdpr] = useState([{ id: 'g1', user: 'UserOld', type: 'Delete Data', status: 'Pending' }]);

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    if (subTab === 'TICKETS') {
        return <GenericModule<Ticket> title="Support Tickets" data={tickets}
            columns={[{key:'subject', label:'Subject'}, {key:'type', label:'Type'}, {key:'status', label:'Status', render: t => <Badge>{t.status}</Badge>}, {key:'priority', label:'Priority'}]}
            fields={[{key:'status', label:'Status', type:'select', options:['Open','Resolved']}, {key:'priority', label:'Priority', type:'select', options:['Low','High']}]}
            onSave={handleSave(setTickets, tickets)} onDelete={handleDelete(setTickets, tickets)} />;
    }
    if (subTab === 'KYC') {
        return <GenericModule<KYCRequest> title="KYC Verification" data={kyc}
            columns={[{key:'username', label:'User'}, {key:'type', label:'Doc Type'}, {key:'status', label:'Status', render: k => <Badge variant={k.status==='Pending'?'warning':'success'}>{k.status}</Badge>}]}
            fields={[{key:'status', label:'Verdict', type:'select', options:['Pending','Approved','Rejected']}]}
            onSave={handleSave(setKyc, kyc)} onDelete={handleDelete(setKyc, kyc)} />;
    }
    if (subTab === 'DISPUTES') {
         return <GenericModule<Dispute> title="Disputes" data={disputes}
            columns={[{key:'orderId', label:'Order ID'}, {key:'reason', label:'Reason'}, {key:'status', label:'Status'}]}
            fields={[{key:'status', label:'Status', type:'select', options:['Open','Resolved','Closed']}]}
            onSave={handleSave(setDisputes, disputes)} onDelete={handleDelete(setDisputes, disputes)} />;
    }
    if (subTab === 'REVIEWS') {
         return <GenericModule<Review> title="User Reviews" data={reviews}
            columns={[{key:'text', label:'Comment'}, {key:'rating', label:'Rating'}, {key:'status', label:'Status'}]}
            fields={[{key:'status', label:'Status', type:'select', options:['Approved','Flagged']}]}
            onSave={handleSave(setReviews, reviews)} onDelete={handleDelete(setReviews, reviews)} />;
    }
    if (subTab === 'GDPR') {
        return <GenericModule title="GDPR Requests" data={gdpr} columns={[{key:'user', label:'User'}, {key:'type', label:'Request'}, {key:'status', label:'Status'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />;
    }

    return <div>Select Support Module</div>;
}
