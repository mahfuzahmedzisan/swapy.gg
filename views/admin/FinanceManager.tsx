
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { Transaction, WithdrawalRequest, SubscriptionPlan } from '../../types';
import { Badge, Button, Input, Card, Select, DevNote } from '../../components/UIComponents';
import { Search, Download, CheckCircle, XCircle, FileText, Undo2, Ban } from 'lucide-react';

interface FinanceManagerProps {
    subTab: string;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({ subTab }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: 't1', type: 'Sale', amount: 50.00, user: 'Buyer1', status: 'Completed', date: '2025-10-20', method: 'Balance' },
        { id: 't2', type: 'Withdrawal', amount: 200.00, user: 'Seller1', status: 'Pending', date: '2025-10-21', method: 'PayPal' },
        { id: 't3', type: 'Deposit', amount: 1000.00, user: 'WhaleUser', status: 'Completed', date: '2025-10-22', method: 'Crypto' }
    ]);

    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
        { id: 'w1', sellerId: 's1', username: 'PixelStore', amount: 500, method: 'Payoneer', status: 'Pending', date: '2025-10-20' },
        { id: 'w2', sellerId: 's3', username: 'ProGamer', amount: 120, method: 'Crypto', status: 'Pending', date: '2025-10-23' }
    ]);

    const [subs, setSubs] = useState<SubscriptionPlan[]>([
        { id: 'sub1', name: 'Pro Seller', price: 19.99, interval: 'Monthly', activeSubscribers: 140 }
    ]);

    // Transaction Filtering
    const [txFilter, setTxFilter] = useState('');

    // Settings
    const [fees, setFees] = useState({ buyerFee: 2.5, sellerFee: 5.0, minFee: 0.50 });

    const handleRefund = (id: string) => {
        if(window.confirm(`Refund transaction ${id}? This will reverse the funds.`)) {
            setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Failed' } : t));
        }
    }

    const handleInvoice = (id: string) => {
        alert(`Generating PDF invoice for transaction #${id}...`);
    }

    if (subTab === 'TRANSACTIONS') {
        const filteredTx = transactions.filter(t => 
            t.user.toLowerCase().includes(txFilter.toLowerCase()) || 
            t.id.toLowerCase().includes(txFilter.toLowerCase())
        );

        return (
            <div className="space-y-4">
                <DevNote title="Backend: Immutable Ledger (Double-Entry)">
                    <strong>1. Data Integrity:</strong> Never use `DELETE` on the transactions table. All adjustments must be new rows. <br/>
                    <strong>2. Refund Logic:</strong> A refund is a NEW transaction with type `Refund` and negative amount, referencing the original `parent_id`. <br/>
                    <strong>3. Integrity Check:</strong> `SUM(amount)` for a specific user_id MUST always equal their current `wallet_balance`. Run nightly jobs to verify this.
                </DevNote>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Transactions</h2>
                    <Button variant="outline" icon={Download}>Export CSV</Button>
                </div>
                <div className="bg-nexus-card border border-nexus-border rounded-lg p-4">
                    <div className="mb-4 max-w-sm">
                        <Input icon={Search} placeholder="Search User or ID..." value={txFilter} onChange={e => setTxFilter(e.target.value)} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-nexus-main text-xs uppercase font-bold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-nexus-border">
                                {filteredTx.map(t => (
                                    <tr key={t.id} className="hover:bg-nexus-hover">
                                        <td className="px-6 py-4 font-mono">{t.id}</td>
                                        <td className="px-6 py-4 font-bold text-white">{t.user}</td>
                                        <td className="px-6 py-4">{t.type}</td>
                                        <td className={`px-6 py-4 font-bold ${t.type === 'Withdrawal' ? 'text-red-400' : 'text-green-400'}`}>
                                            {t.type === 'Withdrawal' ? '-' : '+'}${t.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">{t.method}</td>
                                        <td className="px-6 py-4">{t.date}</td>
                                        <td className="px-6 py-4"><Badge variant={t.status === 'Completed' ? 'success' : (t.status === 'Failed' ? 'danger' : 'warning')}>{t.status}</Badge></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleInvoice(t.id)} title="Download Invoice" className="text-gray-400 hover:text-white"><FileText size={16}/></button>
                                                {t.status === 'Completed' && t.type === 'Sale' && (
                                                    <button onClick={() => handleRefund(t.id)} title="Refund" className="text-red-500 hover:text-red-400"><Undo2 size={16}/></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    if (subTab === 'WITHDRAWALS') {
        return (
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-white">Withdrawal Requests</h2>
                 <DevNote title="ACID Transactions & Security">
                     <strong>1. Atomic Operation:</strong> Approving a withdrawal must be wrapped in a DB transaction block: `BEGIN` - Deduct Wallet - Create Withdrawal Record - `COMMIT`. <br/>
                     <strong>2. Manual Review:</strong> For amounts - $500, flag for manual admin approval (require 2FA to approve).
                 </DevNote>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {withdrawals.map(w => (
                         <div key={w.id} className="bg-nexus-card border border-nexus-border rounded-xl p-5 flex justify-between items-center">
                             <div>
                                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">Request {w.id}</div>
                                 <div className="font-black text-2xl text-white">${w.amount.toFixed(2)}</div>
                                 <div className="text-sm text-gray-300 mt-1">User: <span className="font-bold text-nexus-primary">{w.username}</span></div>
                                 <div className="text-xs text-gray-500 mt-1">Method: {w.method} • {w.date}</div>
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Button size="sm" variant="success" icon={CheckCircle} onClick={() => {
                                     setWithdrawals(withdrawals.map(req => req.id === w.id ? {...req, status: 'Completed'} : req))
                                 }}>Approve</Button>
                                 <Button size="sm" variant="danger" icon={XCircle} onClick={() => {
                                      setWithdrawals(withdrawals.map(req => req.id === w.id ? {...req, status: 'Rejected'} : req))
                                 }}>Reject</Button>
                             </div>
                         </div>
                     ))}
                     {withdrawals.length === 0 && <div className="text-gray-500">No pending withdrawals.</div>}
                 </div>
             </div>
        );
    }

    if (subTab === 'TAXES') {
         return (
             <>
                <DevNote title="Tax Compliance Service">
                    <strong>VAT MOSS / Sales Tax:</strong> Integrate with Stripe Tax or Avalara to calculate taxes dynamically based on Buyer's IP/Billing Address. <br/>
                    Do not rely on static rules tables for production legal compliance.
                </DevNote>
                <GenericModule<any> // Using simplified types for brevity in update
                    title="Tax Rules"
                    data={[]}
                    columns={[{key: 'country', label: 'Country'}]}
                    fields={[]}
                    onSave={()=>{}}
                    onDelete={()=>{}}
                />
             </>
         );
    }

    if (subTab === 'SUBSCRIPTIONS') {
         return (
             <>
                <DevNote title="Recurring Billing Webhooks">
                    Subscriptions logic is event-driven. <br/>
                    <strong>1. `invoice.payment_succeeded`:</strong> Extend user's premium status expiry date. <br/>
                    <strong>2. `customer.subscription.deleted`:</strong> Set premium status to false immediately.
                </DevNote>
                <GenericModule<SubscriptionPlan>
                    title="Subscription Plans"
                    data={subs}
                    columns={[
                        { key: 'name', label: 'Plan Name' },
                        { key: 'price', label: 'Price' },
                        { key: 'interval', label: 'Interval' },
                        { key: 'activeSubscribers', label: 'Subscribers' },
                        { key: 'actions', label: 'Actions', render: (p) => (
                            <Button size="sm" variant="danger" icon={Ban} onClick={() => alert("Are you sure? This will cancel all subscriptions for this plan.")}>Cancel All</Button>
                        )}
                    ]}
                    fields={[
                        { key: 'name', label: 'Name', type: 'text' },
                        { key: 'price', label: 'Price', type: 'number' },
                        { key: 'interval', label: 'Interval', type: 'select', options: ['Monthly', 'Yearly'] }
                    ]}
                    onSave={(item) => {
                        if(subs.find(i => i.id === item.id)) setSubs(subs.map(i => i.id === item.id ? item : i));
                        else setSubs([...subs, item]);
                    }}
                    onDelete={(id) => setSubs(subs.filter(t => t.id !== id))}
                />
             </>
         );
    }
    
    if (subTab === 'SETTINGS') {
        return (
            <Card title="Fee Configuration">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Buyer Fee (%)" type="number" value={fees.buyerFee} onChange={e => setFees({...fees, buyerFee: Number(e.target.value)})} />
                    <Input label="Seller Fee (%)" type="number" value={fees.sellerFee} onChange={e => setFees({...fees, sellerFee: Number(e.target.value)})} />
                    <Input label="Minimum Fixed Fee ($)" type="number" value={fees.minFee} onChange={e => setFees({...fees, minFee: Number(e.target.value)})} />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => alert("Fee settings saved.")}>Update Fees</Button>
                </div>
            </Card>
        );
    }
    
    if (subTab === 'ESCROW') return (
        <div className="space-y-4">
            <DevNote title="Escrow State Logic">
                The Escrow wallet is a system-owned wallet. Funds sit here with a `order_id` tag. <br/>
                Funds are only released when `order.status` transitions to `COMPLETED`. <br/>
                Implement a cron job to auto-release funds if `status == DELIVERED` for - 48 hours and no dispute exists.
            </DevNote>
            <div className="p-8 text-white bg-nexus-card rounded border border-nexus-border">Escrow Monitor: 14 Active Safe Trades</div>
        </div>
    );

    return <div>Select a Finance Module</div>;
};
