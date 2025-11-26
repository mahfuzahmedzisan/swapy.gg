
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { Ticket, KYCRequest, Review, Dispute } from '../../types';
import { Badge, Button, Modal, TextArea, Select, Input, DevNote } from '../../components/UIComponents';
import { MessageSquare, Send, Check, X, FileText, AlertTriangle } from 'lucide-react';

export const SupportManager: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    const [tickets, setTickets] = useState<Ticket[]>([
        { id: 't1', userId: 'u1', subject: 'Login Issue', type: 'Technical', status: 'Open', priority: 'High', createdAt: '2025-10-25', lastUpdate: 'Now' }
    ]);
    const [kyc, setKyc] = useState<KYCRequest[]>([
        { id: 'k1', userId: 'u5', username: 'NewSeller', type: 'Passport', status: 'Pending', submittedAt: '2025-10-24', images: ['https://picsum.photos/400/300'] }
    ]);
    const [disputes, setDisputes] = useState<Dispute[]>([
        { id: 'd1', orderId: 'ord_55', buyer: 'BuyerX', seller: 'SellerY', reason: 'Not delivered', status: 'Open', createdAt: '2025-10-20' }
    ]);
    const [reviews, setReviews] = useState<Review[]>([
        { id: 'r1', author: 'User1', rating: 'Positive', text: 'Great service!', date: '2025-10-10', itemName: 'Gold', status: 'Approved' }
    ]);

    // CANNED RESPONSES STATE
    const [responses, setResponses] = useState([
        { id: 'r1', title: 'Refund Policy', text: 'We only refund if the item was not delivered.' },
        { id: 'r2', title: 'KYC Info', text: 'Please upload a clear photo of your ID.' }
    ]);

    // TICKET CHAT STATE
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
    const [ticketMsg, setTicketMsg] = useState('');

    // KYC MODAL STATE
    const [viewingKyc, setViewingKyc] = useState<KYCRequest | null>(null);

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    const handleKycAction = (id: string, status: 'Approved' | 'Rejected') => {
        setKyc(kyc.map(k => k.id === id ? { ...k, status } : k));
        setViewingKyc(null);
    };

    const insertCannedResponse = (text: string) => {
        setTicketMsg(prev => prev + text);
    };

    if (subTab === 'TICKETS') {
        return (
            <>
                <DevNote title="Auto-Routing Algorithm">
                    Implement logic to auto-assign tickets to staff based on: <br/>
                    1. <strong>Ticket Type:</strong> 'Billing' -> Finance Team, 'Report' -> Moderators. <br/>
                    2. <strong>Staff Load:</strong> Assign to the online agent with the fewest open tickets.
                </DevNote>
                <GenericModule<Ticket> title="Support Tickets" data={tickets}
                    columns={[
                        {key:'subject', label:'Subject'}, 
                        {key:'type', label:'Type'}, 
                        {key:'status', label:'Status', render: t => <Badge>{t.status}</Badge>}, 
                        {key:'priority', label:'Priority', render: t => <Badge variant={t.priority==='High'?'danger':'warning'}>{t.priority}</Badge>},
                        {key:'actions', label:'Actions', render: t => <Button size="sm" icon={MessageSquare} onClick={() => setActiveTicket(t)}>Reply</Button>}
                    ]}
                    fields={[{key:'status', label:'Status', type:'select', options:['Open','Resolved']}, {key:'priority', label:'Priority', type:'select', options:['Low','High']}]}
                    onSave={handleSave(setTickets, tickets)} onDelete={handleDelete(setTickets, tickets)} 
                />

                <Modal isOpen={!!activeTicket} onClose={() => setActiveTicket(null)} title={`Ticket #${activeTicket?.id} - ${activeTicket?.subject}`}>
                    <div className="flex justify-end mb-2">
                        <Button size="sm" variant="danger" icon={AlertTriangle} onClick={() => alert("Ticket Escalated to Admin Team")}>Escalate Ticket</Button>
                    </div>
                    <div className="h-64 bg-nexus-main border border-nexus-border rounded p-4 mb-4 overflow-y-auto">
                        <div className="text-sm text-gray-300 mb-2 p-2 bg-nexus-card rounded">User: I cannot login to my account.</div>
                        <div className="text-sm text-white text-right mb-2 p-2 bg-nexus-primary rounded">Support: We are checking your logs.</div>
                    </div>
                    
                    <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
                        {responses.map(r => (
                            <button key={r.id} onClick={() => insertCannedResponse(r.text)} className="text-xs bg-[#150d22] border border-nexus-border px-2 py-1 rounded whitespace-nowrap hover:bg-nexus-hover">
                                {r.title}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <TextArea placeholder="Type reply..." value={ticketMsg} onChange={e => setTicketMsg(e.target.value)} rows={2} />
                        <Button icon={Send} className="h-auto">Send</Button>
                    </div>
                </Modal>
            </>
        );
    }
    
    if (subTab === 'RESPONSES') {
        return <GenericModule title="Canned Responses" data={responses}
            columns={[{key:'title', label:'Title'}, {key:'text', label:'Content'}]}
            fields={[{key:'title', label:'Title', type:'text'}, {key:'text', label:'Content', type:'textarea'}]}
            onSave={handleSave(setResponses, responses)} onDelete={handleDelete(setResponses, responses)} 
        />;
    }

    if (subTab === 'KYC') {
        return (
            <>
                <GenericModule<KYCRequest> title="KYC Verification" data={kyc}
                    columns={[
                        {key:'username', label:'User'}, 
                        {key:'type', label:'Doc Type'}, 
                        {key:'status', label:'Status', render: k => <Badge variant={k.status==='Pending'?'warning':(k.status==='Approved'?'success':'danger')}>{k.status}</Badge>},
                        {key:'actions', label:'Review', render: k => <Button size="sm" icon={FileText} onClick={() => setViewingKyc(k)}>Review</Button>}
                    ]}
                    fields={[{key:'status', label:'Verdict', type:'select', options:['Pending','Approved','Rejected']}]}
                    onSave={handleSave(setKyc, kyc)} onDelete={handleDelete(setKyc, kyc)} 
                />

                <Modal isOpen={!!viewingKyc} onClose={() => setViewingKyc(null)} title={`Review KYC: ${viewingKyc?.username}`}>
                    <div className="space-y-4">
                        <DevNote title="Secure Storage (S3)">
                            KYC images MUST be stored in a private S3 bucket with blocked public access. <br/>
                            To display the image below, generate a <strong>Pre-Signed URL</strong> (valid for 5 minutes only) via the backend API.
                        </DevNote>
                        <div className="aspect-video bg-black rounded flex items-center justify-center overflow-hidden">
                             {viewingKyc?.images[0] ? (
                                <img src={viewingKyc.images[0]} alt="ID Doc" className="max-w-full max-h-full object-contain" />
                             ) : (
                                <div className="text-gray-500">No image loaded</div>
                             )}
                        </div>
                        <div className="flex justify-between items-center bg-nexus-card p-3 rounded border border-nexus-border">
                            <div>
                                <div className="text-xs text-gray-400 uppercase">Document Type</div>
                                <div className="text-white font-bold">{viewingKyc?.type}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400 uppercase">Submitted</div>
                                <div className="text-white font-bold">{viewingKyc?.submittedAt}</div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-nexus-border">
                            <Button variant="danger" icon={X} onClick={() => viewingKyc && handleKycAction(viewingKyc.id, 'Rejected')}>Reject</Button>
                            <Button variant="success" icon={Check} onClick={() => viewingKyc && handleKycAction(viewingKyc.id, 'Approved')}>Approve</Button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
    
    if (subTab === 'DISPUTES') {
         return (
             <>
                <DevNote title="Escrow Lock Logic">
                    When a dispute is 'Open', the order funds MUST remain locked in the Escrow Wallet (`escrow_balance`). <br/>
                    The auto-confirm timer (e.g. 48h) must be PAUSED until the dispute is resolved by an admin.
                </DevNote>
                <GenericModule<Dispute> title="Disputes" data={disputes}
                    columns={[{key:'orderId', label:'Order ID'}, {key:'reason', label:'Reason'}, {key:'status', label:'Status'}]}
                    fields={[{key:'status', label:'Status', type:'select', options:['Open','Resolved','Closed']}]}
                    onSave={handleSave(setDisputes, disputes)} onDelete={handleDelete(setDisputes, disputes)} 
                />
             </>
         );
    }
    
    if (subTab === 'REVIEWS') {
         return <GenericModule<Review> title="User Reviews" data={reviews}
            columns={[{key:'text', label:'Comment'}, {key:'rating', label:'Rating'}, {key:'status', label:'Status'}]}
            fields={[{key:'status', label:'Status', type:'select', options:['Approved','Flagged']}]}
            onSave={handleSave(setReviews, reviews)} onDelete={handleDelete(setReviews, reviews)} />;
    }

    return <div>Select Support Module</div>;
}
