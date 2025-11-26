
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { Transaction, WithdrawalRequest, TaxRule, SubscriptionPlan } from '../../types';
import { Badge } from '../../components/UIComponents';

interface FinanceModuleProps {
    subTab: string;
}

export const FinanceModule: React.FC<FinanceModuleProps> = ({ subTab }) => {
    const [transactions] = useState<Transaction[]>([
        { id: 't1', type: 'Sale', amount: 50.00, user: 'Buyer1', status: 'Completed', date: '2025-10-20' },
        { id: 't2', type: 'Withdrawal', amount: 200.00, user: 'Seller1', status: 'Pending', date: '2025-10-21' }
    ]);

    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
        { id: 'w1', sellerId: 's1', username: 'PixelStore', amount: 500, method: 'Payoneer', status: 'Pending', date: '2025-10-20' }
    ]);

    const [taxes, setTaxes] = useState<TaxRule[]>([
        { id: 'tax1', country: 'Germany', rate: 19, type: 'Digital Goods' }
    ]);

    const [subs, setSubs] = useState<SubscriptionPlan[]>([
        { id: 'sub1', name: 'Pro Seller', price: 19.99, interval: 'Monthly', activeSubscribers: 140 }
    ]);

    if (subTab === 'TRANSACTIONS') {
        return (
             <GenericModule<Transaction>
                title="Transactions"
                data={transactions}
                columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'type', label: 'Type' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'status', label: 'Status', render: (t) => <Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge> }
                ]}
                fields={[]} // Read only mostly
                onSave={() => {}}
                onDelete={() => {}}
            />
        );
    }

    if (subTab === 'WITHDRAWALS') {
        return (
             <GenericModule<WithdrawalRequest>
                title="Withdrawal Requests"
                data={withdrawals}
                columns={[
                    { key: 'username', label: 'Seller' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'method', label: 'Method' },
                    { key: 'status', label: 'Status', render: (w) => <Badge variant={w.status === 'Pending' ? 'warning' : 'success'}>{w.status}</Badge> }
                ]}
                fields={[
                    { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Completed', 'Rejected'] }
                ]}
                onSave={(updated) => setWithdrawals(prev => prev.map(w => w.id === updated.id ? updated : w))}
                onDelete={(id) => setWithdrawals(prev => prev.filter(w => w.id !== id))}
            />
        );
    }

    if (subTab === 'TAXES') {
         return (
             <GenericModule<TaxRule>
                title="Tax Rules"
                data={taxes}
                columns={[
                    { key: 'country', label: 'Country' },
                    { key: 'rate', label: 'Rate (%)' },
                    { key: 'type', label: 'Type' }
                ]}
                fields={[
                    { key: 'country', label: 'Country', type: 'text' },
                    { key: 'rate', label: 'Rate', type: 'number' },
                    { key: 'type', label: 'Type', type: 'select', options: ['Digital Goods', 'Service'] }
                ]}
                onSave={(item) => {
                    if(taxes.find(i => i.id === item.id)) setTaxes(taxes.map(i => i.id === item.id ? item : i));
                    else setTaxes([...taxes, item]);
                }}
                onDelete={(id) => setTaxes(taxes.filter(t => t.id !== id))}
            />
         );
    }

    if (subTab === 'SUBSCRIPTIONS') {
         return (
             <GenericModule<SubscriptionPlan>
                title="Subscription Plans"
                data={subs}
                columns={[
                    { key: 'name', label: 'Plan Name' },
                    { key: 'price', label: 'Price' },
                    { key: 'interval', label: 'Interval' },
                    { key: 'activeSubscribers', label: 'Subscribers' }
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
         );
    }

    return <div>Select a Finance Module</div>;
};
