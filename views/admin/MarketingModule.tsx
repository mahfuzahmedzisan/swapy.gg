
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { Coupon, Lead, Partner, Campaign, ABTest } from '../../types';
import { Badge } from '../../components/UIComponents';

export const MarketingModule: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    // MOCK STATES
    const [coupons, setCoupons] = useState<Coupon[]>([
        { id: 'c1', code: 'SUMMER20', discount: 20, type: 'Percentage', uses: 45, maxUses: 100, status: 'Active' }
    ]);
    const [leads, setLeads] = useState<Lead[]>([
        { id: 'l1', name: 'Big Seller Corp', email: 'biz@corp.com', source: 'LinkedIn', status: 'New' }
    ]);
    const [partners, setPartners] = useState<Partner[]>([
        { id: 'p1', company: 'Razer Gold', contact: 'john@razer.com', status: 'Active' }
    ]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { id: 'cp1', name: 'Google Ads Q4', budget: 5000, clicks: 1240, status: 'Active' }
    ]);
    const [segments] = useState([{ id: 's1', name: 'Whales (Spent > $1k)' }]);
    const [tests, setTests] = useState<ABTest[]>([
        { id: 't1', feature: 'Checkout Flow', variantA: 'One Step', variantB: 'Multi Step', status: 'Running' }
    ]);

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    if (subTab === 'COUPONS') {
        return <GenericModule<Coupon> title="Coupons" data={coupons}
            columns={[{key:'code', label:'Code'}, {key:'discount', label:'Discount'}, {key:'uses', label:'Uses'}, {key:'status', label:'Status'}]}
            fields={[{key:'code', label:'Code', type:'text'}, {key:'discount', label:'Discount', type:'number'}]}
            onSave={handleSave(setCoupons, coupons)} onDelete={handleDelete(setCoupons, coupons)} />;
    }
    if (subTab === 'LEADS') {
        return <GenericModule<Lead> title="Leads (CRM)" data={leads}
            columns={[{key:'name', label:'Name'}, {key:'status', label:'Status', render:(l)=><Badge>{l.status}</Badge>}]}
            fields={[{key:'name', label:'Name', type:'text'}, {key:'status', label:'Status', type:'select', options:['New','Contacted','Converted']}]}
            onSave={handleSave(setLeads, leads)} onDelete={handleDelete(setLeads, leads)} />;
    }
    if (subTab === 'PARTNERS') {
        return <GenericModule<Partner> title="Partners" data={partners}
            columns={[{key:'company', label:'Company'}, {key:'status', label:'Status'}]}
            fields={[{key:'company', label:'Company', type:'text'}, {key:'contact', label:'Contact Email', type:'text'}]}
            onSave={handleSave(setPartners, partners)} onDelete={handleDelete(setPartners, partners)} />;
    }
    if (subTab === 'CAMPAIGNS') {
        return <GenericModule<Campaign> title="Ad Campaigns" data={campaigns}
            columns={[{key:'name', label:'Name'}, {key:'budget', label:'Budget'}, {key:'status', label:'Status'}]}
            fields={[{key:'name', label:'Name', type:'text'}, {key:'budget', label:'Budget', type:'number'}]}
            onSave={handleSave(setCampaigns, campaigns)} onDelete={handleDelete(setCampaigns, campaigns)} />;
    }
    if (subTab === 'SEGMENTS') {
        return <GenericModule title="User Segments" data={segments} columns={[{key:'name', label:'Segment Name'}]} fields={[{key:'name', label:'Name', type:'text'}]} onSave={()=>{}} onDelete={()=>{}} />;
    }
    if (subTab === 'AB_TESTING') {
         return <GenericModule<ABTest> title="A/B Tests" data={tests}
            columns={[{key:'feature', label:'Feature'}, {key:'status', label:'Status'}]}
            fields={[{key:'feature', label:'Feature', type:'text'}, {key:'variantA', label:'A', type:'text'}, {key:'variantB', label:'B', type:'text'}]}
            onSave={handleSave(setTests, tests)} onDelete={handleDelete(setTests, tests)} />;
    }

    return <div>Select Marketing Module</div>;
}
