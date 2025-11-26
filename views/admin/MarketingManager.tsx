
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { Coupon, Campaign } from '../../types';
import { Badge, Button, Card, Input, Select, Checkbox, DevNote } from '../../components/UIComponents';
import { Plus, Trash2, Zap, Clock, Save, Share2 } from 'lucide-react';

export const MarketingManager: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    // MOCK STATES
    const [coupons, setCoupons] = useState<Coupon[]>([
        { id: 'c1', code: 'SUMMER20', discount: 20, type: 'Percentage', uses: 45, maxUses: 100, status: 'Active' }
    ]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { id: 'cp1', name: 'Google Ads Q4', budget: 5000, clicks: 1240, status: 'Active' }
    ]);

    // FLASH SALES STATE
    const [flashSales, setFlashSales] = useState([
        { id: 'fs1', title: 'Black Friday Boost', discount: 50, category: 'Boosting', endsIn: '24h', active: true }
    ]);
    const [newFlashSale, setNewFlashSale] = useState({ title: '', discount: 0, category: 'All' });

    // REFERRAL STATE
    const [referralConfig, setReferralConfig] = useState({
        commissionRate: 5,
        cookieDuration: 30,
        minPayout: 50,
        enableAffiliates: true
    });

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    const handleAddFlashSale = () => {
        if(!newFlashSale.title) return;
        setFlashSales([...flashSales, { ...newFlashSale, id: Date.now().toString(), endsIn: '48h', active: true }]);
        setNewFlashSale({ title: '', discount: 0, category: 'All' });
    };

    if (subTab === 'COUPONS') {
        return (
            <>
                <DevNote title="Race Condition: Coupon Usage">
                    When a coupon is applied at checkout, use an atomic DB update (e.g. `UPDATE coupons SET uses = uses + 1 WHERE code = ? AND uses &lt; maxUses`). <br/>
                    This prevents users from redeeming more coupons than the `maxUses` limit during high traffic bursts.
                </DevNote>
                <GenericModule<Coupon> title="Coupons" data={coupons}
                    columns={[{key:'code', label:'Code'}, {key:'discount', label:'Discount'}, {key:'uses', label:'Uses'}, {key:'status', label:'Status', render: c => <Badge variant={c.status==='Active'?'success':'danger'}>{c.status}</Badge>}]}
                    fields={[{key:'code', label:'Code', type:'text'}, {key:'discount', label:'Discount', type:'number'}, {key:'status', label:'Status', type:'select', options:['Active','Expired']}]}
                    onSave={handleSave(setCoupons, coupons)} onDelete={handleDelete(setCoupons, coupons)} 
                />
            </>
        );
    }
    
    if (subTab === 'CAMPAIGNS') {
        return <GenericModule<Campaign> title="Ad Campaigns" data={campaigns}
            columns={[{key:'name', label:'Name'}, {key:'budget', label:'Budget ($)'}, {key:'clicks', label:'Clicks'}, {key:'status', label:'Status', render: c => <Badge>{c.status}</Badge>}]}
            fields={[{key:'name', label:'Name', type:'text'}, {key:'budget', label:'Budget', type:'number'}, {key:'status', label:'Status', type:'select', options:['Active','Paused']}]}
            onSave={handleSave(setCampaigns, campaigns)} onDelete={handleDelete(setCampaigns, campaigns)} />;
    }
    
    if (subTab === 'FLASH_SALES') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Active Flash Sales">
                    <div className="space-y-4">
                        {flashSales.map(fs => (
                            <div key={fs.id} className="bg-nexus-main border border-nexus-border p-4 rounded-xl flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-white flex items-center gap-2"><Zap size={14} className="text-yellow-500 fill-yellow-500"/> {fs.title}</div>
                                    <div className="text-xs text-gray-400 mt-1">Target: {fs.category} • Ends in: {fs.endsIn}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-2xl text-green-400">{fs.discount}% OFF</div>
                                    <button onClick={() => setFlashSales(flashSales.filter(f => f.id !== fs.id))} className="text-xs text-red-500 hover:underline">End Sale</button>
                                </div>
                            </div>
                        ))}
                        {flashSales.length === 0 && <div className="text-gray-500 text-center py-4">No active flash sales.</div>}
                    </div>
                </Card>

                <Card title="Launch New Flash Sale">
                    <div className="space-y-4">
                        <DevNote title="High Performance Caching">
                            Active flash sales MUST be cached in Redis or injected into the frontend via initial props. <br/>
                            Do not query the DB for active sales on every product page render.
                        </DevNote>
                        <Input label="Sale Title" placeholder="e.g. Weekend Madness" value={newFlashSale.title} onChange={e => setNewFlashSale({...newFlashSale, title: e.target.value})} />
                        <Input label="Discount Percentage (%)" type="number" value={newFlashSale.discount} onChange={e => setNewFlashSale({...newFlashSale, discount: Number(e.target.value)})} />
                        <Select label="Target Category" value={newFlashSale.category} onChange={e => setNewFlashSale({...newFlashSale, category: e.target.value})}>
                            <option value="All">Entire Store</option>
                            <option value="Currency">Currency</option>
                            <option value="Accounts">Accounts</option>
                            <option value="Boosting">Boosting</option>
                        </Select>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-500 flex items-start gap-2">
                            <Clock size={16} className="shrink-0"/>
                            Warning: Flash sales override individual seller prices. Platform will subsidize the difference if configured, or sellers must opt-in.
                        </div>
                        <Button fullWidth icon={Zap} onClick={handleAddFlashSale} variant="gold">Launch Sale</Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (subTab === 'REFERRALS') {
        return (
            <Card title="Affiliate Program Settings" action={<Button icon={Save}>Save Settings</Button>}>
                <div className="space-y-6">
                    <DevNote title="Tracking Logic">
                        <strong>1. Attribution:</strong> Use a first-touch or last-touch attribution model based on the `?ref=CODE` URL parameter. <br/>
                        <strong>2. Cookies:</strong> Set a tracking cookie with the duration specified below. <br/>
                        <strong>3. Fraud:</strong> Prevent self-referrals by checking IP and device fingerprint matching between referrer and referee.
                    </DevNote>
                    <div className="bg-nexus-main p-4 rounded-lg border border-nexus-border">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2"><Share2 size={16} className="text-nexus-primary"/> Program Configuration</h3>
                                <p className="text-xs text-gray-500">Configure global settings for the affiliate system.</p>
                            </div>
                            <Checkbox label="Enable Program" checked={referralConfig.enableAffiliates} onChange={() => setReferralConfig({...referralConfig, enableAffiliates: !referralConfig.enableAffiliates})} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input label="Commission Rate (%)" type="number" value={referralConfig.commissionRate} onChange={e => setReferralConfig({...referralConfig, commissionRate: Number(e.target.value)})} />
                            <Input label="Cookie Duration (Days)" type="number" value={referralConfig.cookieDuration} onChange={e => setReferralConfig({...referralConfig, cookieDuration: Number(e.target.value)})} />
                            <Input label="Min Payout Threshold ($)" type="number" value={referralConfig.minPayout} onChange={e => setReferralConfig({...referralConfig, minPayout: Number(e.target.value)})} />
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                        <h4 className="text-green-400 font-bold text-sm mb-2">Pro Tip</h4>
                        <p className="text-xs text-gray-400">Higher commission rates (10%+) generally attract more influencers but reduce platform margins. Recommended starting rate is 5%.</p>
                    </div>
                </div>
            </Card>
        );
    }

    return <div>Select Marketing Module</div>;
}
