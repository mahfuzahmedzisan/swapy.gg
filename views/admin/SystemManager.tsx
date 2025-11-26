
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { SystemLog, ApiKey, Webhook, Plugin, Backup } from '../../types';
import { Badge, Button, Card, Checkbox, Input, Select, TextArea, DevNote } from '../../components/UIComponents';
import { RefreshCw, Bell, Shield, Lock, Server, Play, AlertOctagon, Download, Upload, RotateCcw, Package } from 'lucide-react';

export const SystemManager: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    // MOCK DATA
    const [logs] = useState<SystemLog[]>([
        { id: 'l1', action: 'User Login', admin: 'System', ip: '127.0.0.1', timestamp: '2025-10-25', level: 'Info' },
        { id: 'l2', action: 'Payment Failed', admin: 'Stripe', ip: '0.0.0.0', timestamp: '2025-10-25', level: 'Error' }
    ]);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([{ id: 'k1', key: 'sk_live_...9f2a', service: 'Stripe', lastUsed: 'Just now' }]);
    const [webhooks, setWebhooks] = useState<Webhook[]>([{ id: 'w1', url: 'https://site.com/callback', events: ['order.created'], status: 'Active' }]);
    
    // Plugins State
    const [plugins, setPlugins] = useState<Plugin[]>([
        { id: 'pl1', name: 'Google Analytics', version: '4.0', status: 'Active' },
        { id: 'pl2', name: 'Sentry Error Tracking', version: '1.2', status: 'Inactive' }
    ]);
    const [availablePlugins] = useState([
        { id: 'store1', name: 'Mailchimp Integration', desc: 'Sync users to email lists' },
        { id: 'store2', name: 'Cloudflare Turnstile', desc: 'Captcha protection' },
        { id: 'store3', name: 'Intercom Chat', desc: 'Live support widget' }
    ]);

    // Backups State
    const [backups, setBackups] = useState<Backup[]>([{ id: 'b1', filename: 'db_snap_01.sql', size: '45MB', date: 'Yesterday' }]);

    // Functional State
    const [isFlushing, setIsFlushing] = useState(false);
    const [securityConfig, setSecurityConfig] = useState({ twoFactor: true, passwordStrength: 'Strong', sessionTimeout: 30 });
    const [notification, setNotification] = useState({ title: '', message: '', target: 'All' });
    const [integrations, setIntegrations] = useState([
        { id: 'discord', name: 'Discord Bot', connected: true },
        { id: 'slack', name: 'Slack Alerts', connected: false },
        { id: 'stripe', name: 'Stripe Payments', connected: true },
        { id: 'twilio', name: 'Twilio SMS', connected: false },
    ]);

    // DB State
    const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 10;');
    const [sqlResult, setSqlResult] = useState('');

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    const handleFlushCache = () => {
        setIsFlushing(true);
        setTimeout(() => {
            setIsFlushing(false);
            alert("Redis Cache Flushed Successfully!");
        }, 1500);
    };

    const sendNotification = () => {
        if(!notification.title || !notification.message) return;
        alert(`Notification Sent to ${notification.target}: ${notification.title}`);
        setNotification({ title: '', message: '', target: 'All' });
    };

    const toggleIntegration = (id: string) => {
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    };

    const runQuery = () => {
        setSqlResult("Query executed successfully. 10 rows returned (Mock).");
    }

    const handleInstallPlugin = (p: any) => {
        setPlugins([...plugins, { id: `pl_${Date.now()}`, name: p.name, version: '1.0', status: 'Active' }]);
    }

    const handleRegenerateKey = (id: string) => {
        if(confirm("Regenerate this key? The old one will stop working.")) {
            setApiKeys(apiKeys.map(k => k.id === id ? { ...k, key: `sk_live_NEW_${Date.now()}` } : k));
        }
    }

    const handleRestoreBackup = (id: string) => {
        if(confirm("WARNING: Restore this backup? Current data will be overwritten.")) {
            alert("Restoration process started...");
        }
    }

    // SYSTEM
    if (subTab === 'LOGS') return (
        <div className="space-y-6">
            <DevNote title="Audit Trail Immutability">
                Logs must be write-only. 
                Implement log rotation to S3 Glacier for long-term retention (compliance). 
                Logs should include `actor_id`, `action_type`, `resource_id`, and `previous_state` (for rollbacks).
            </DevNote>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-nexus-main p-4 rounded border border-nexus-border text-center">
                    <div className="text-2xl font-bold text-red-500">1</div>
                    <div className="text-xs text-gray-500">Critical Errors</div>
                </div>
                <div className="bg-nexus-main p-4 rounded border border-nexus-border text-center">
                    <div className="text-2xl font-bold text-yellow-500">0</div>
                    <div className="text-xs text-gray-500">Warnings</div>
                </div>
                <div className="bg-nexus-main p-4 rounded border border-nexus-border text-center">
                    <div className="text-2xl font-bold text-green-500">98%</div>
                    <div className="text-xs text-gray-500">Uptime</div>
                </div>
            </div>
            <GenericModule<SystemLog> title="System Logs" data={logs} columns={[{key:'timestamp', label:'Time'}, {key:'level', label:'Level', render: l=><Badge variant={l.level==='Error'?'danger':'success'}>{l.level}</Badge>}, {key:'action', label:'Action'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />
        </div>
    );

    if (subTab === 'DATABASE') return (
        <div className="space-y-6">
            <div className="p-4 bg-nexus-card border border-nexus-border rounded-lg text-green-400 font-mono flex items-center gap-2">
                <Server size={18}/> Database Connection: OK (Latency: 5ms)
            </div>
            <Card title="SQL Runner">
                <div className="space-y-4">
                    <DevNote title="Danger Zone: SQL Injection Prevention">
                        1. This tool must use a restricted database user with <strong>READ-ONLY</strong> permissions (SELECT only). <br/>
                        2. Use prepared statements or parameterized queries even in this admin tool. <br/>
                        3. Log every query executed here to the Audit Trail.
                    </DevNote>
                    <TextArea className="font-mono text-sm" rows={5} value={sqlQuery} onChange={e => setSqlQuery(e.target.value)} />
                    <div className="flex justify-end">
                        <Button icon={Play} onClick={runQuery}>Execute Query</Button>
                    </div>
                    {sqlResult && (
                        <div className="p-4 bg-black rounded border border-nexus-border font-mono text-xs text-green-400">
                            {sqlResult}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
    
    if (subTab === 'CACHE') return (
        <Card title="System Cache">
            <DevNote title="Redis Eviction Policy">
                Use `allkeys-lru` eviction policy for Redis. <br/>
                Flushing cache here should broadcast a pub/sub message to all API nodes to clear their local in-memory caches as well.
            </DevNote>
            <div className="flex items-center justify-between p-4 bg-nexus-main rounded-lg border border-nexus-border">
                <div>
                    <h3 className="text-white font-bold">Redis Cache</h3>
                    <p className="text-sm text-gray-500">Clear temporary data to refresh system state.</p>
                </div>
                <Button 
                    icon={RefreshCw} 
                    variant={isFlushing ? 'secondary' : 'danger'} 
                    onClick={handleFlushCache} 
                    disabled={isFlushing}
                    className={isFlushing ? 'animate-pulse' : ''}
                >
                    {isFlushing ? 'Flushing...' : 'Flush Cache'}
                </Button>
            </div>
        </Card>
    );

    if (subTab === 'BACKUPS') return (
        <div className="space-y-6">
            <DevNote title="Disaster Recovery">
                Automated backups should run daily via Cron Job and be stored in an encrypted S3 bucket (AWS) or GCS (Google). <br/>
                Retain daily backups for 30 days, weekly for 1 year.
            </DevNote>
            <GenericModule<Backup> 
                title="Backups" 
                data={backups} 
                columns={[
                    {key:'filename', label:'File'}, 
                    {key:'size', label:'Size'}, 
                    {key:'date', label:'Date'},
                    {key:'actions', label:'Actions', render: b => (
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" icon={Download}>Download</Button>
                            <Button size="sm" variant="danger" icon={RotateCcw} onClick={() => handleRestoreBackup(b.id)}>Restore</Button>
                        </div>
                    )}
                ]} 
                fields={[]} onSave={()=>{}} onDelete={()=>{}} 
            />
            <div className="flex justify-end">
                <Button icon={Upload} onClick={() => setBackups([...backups, { id: `b_${Date.now()}`, filename: `manual_snap_${Date.now()}.sql`, size: '0.5MB', date: 'Just now' }])}>Create Manual Snapshot</Button>
            </div>
        </div>
    );
    
    if (subTab === 'SECURITY') return (
        <Card title="Security Settings" action={<Button>Save Settings</Button>}>
            <div className="space-y-6">
                <div className="bg-nexus-main p-4 rounded-lg border border-nexus-border">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Lock size={16} className="text-nexus-primary"/> Authentication</h3>
                    <div className="space-y-4">
                        <Checkbox label="Enforce 2FA for Admins" checked={securityConfig.twoFactor} onChange={() => setSecurityConfig({...securityConfig, twoFactor: !securityConfig.twoFactor})} />
                        <Select label="Password Strength Policy" value={securityConfig.passwordStrength} onChange={(e) => setSecurityConfig({...securityConfig, passwordStrength: e.target.value})}>
                            <option value="Standard">Standard</option>
                            <option value="Strong">Strong (Symbols required)</option>
                            <option value="Extreme">Extreme (16+ chars)</option>
                        </Select>
                        <Input label="Session Timeout (Minutes)" type="number" value={securityConfig.sessionTimeout} onChange={(e) => setSecurityConfig({...securityConfig, sessionTimeout: Number(e.target.value)})} />
                    </div>
                </div>
            </div>
        </Card>
    );

    if (subTab === 'MAINTENANCE') return <div className="p-4 text-white">Maintenance Mode: <Badge variant="danger">OFF</Badge></div>;
    if (subTab === 'SYSTEM_INFO') return <div className="p-4 text-white font-mono bg-nexus-card border border-nexus-border rounded">Node v18.16.0 | Memory: 512MB/2048MB | Uptime: 45d</div>;

    // DEV
    if (subTab === 'DEVELOPERS') return (
         <GenericModule<ApiKey> 
            title="API Keys" 
            data={apiKeys} 
            columns={[
                {key:'service', label:'Service'}, 
                {key:'key', label:'Key'}, 
                {key:'lastUsed', label:'Last Used'},
                {key:'actions', label:'Actions', render: k => <Button size="sm" variant="secondary" onClick={() => handleRegenerateKey(k.id)}>Regenerate</Button>}
            ]} 
            fields={[{key:'service', label:'Service Name', type:'text'}, {key:'key', label:'Key Value', type:'text'}]} 
            onSave={handleSave(setApiKeys, apiKeys)} 
            onDelete={handleDelete(setApiKeys, apiKeys)} 
         />
    );

    if (subTab === 'WEBHOOKS') return (
        <>
            <DevNote title="Webhook Resilience & Security">
                <strong>1. Retry Logic:</strong> Implement exponential backoff for failed deliveries. Mark as 'Failed' after 5 attempts. <br/>
                <strong>2. Signatures:</strong> All outgoing webhooks must include an `X-Signature` header (HMAC-SHA256) so receivers can verify authenticity.
            </DevNote>
            <GenericModule<Webhook> title="Webhooks" data={webhooks} columns={[{key:'url', label:'URL'}, {key:'status', label:'Status'}]} fields={[{key:'url', label:'Endpoint URL', type:'text'}]} onSave={handleSave(setWebhooks, webhooks)} onDelete={handleDelete(setWebhooks, webhooks)} />
        </>
    );
    
    if (subTab === 'PLUGINS') return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GenericModule<Plugin> title="Installed Plugins" data={plugins} columns={[{key:'name', label:'Plugin'}, {key:'version', label:'Ver'}, {key:'status', label:'Status'}]} fields={[]} onSave={handleSave(setPlugins, plugins)} onDelete={handleDelete(setPlugins, plugins)} />
            
            <Card title="Plugin Store">
                <div className="space-y-4">
                    {availablePlugins.map(p => (
                        <div key={p.id} className="p-4 bg-nexus-main border border-nexus-border rounded flex justify-between items-center">
                            <div>
                                <div className="font-bold text-white flex items-center gap-2"><Package size={14}/> {p.name}</div>
                                <div className="text-xs text-gray-500">{p.desc}</div>
                            </div>
                            <Button size="sm" variant="primary" onClick={() => handleInstallPlugin(p)} disabled={plugins.some(pl => pl.name === p.name)}>
                                {plugins.some(pl => pl.name === p.name) ? 'Installed' : 'Install'}
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
    
    if (subTab === 'IP_WHITELIST') return <GenericModule title="IP Whitelist" data={[{id:'ip1', ip:'127.0.0.1'}]} columns={[{key:'ip', label:'IP Address'}]} fields={[{key:'ip', label:'IP', type:'text'}]} onSave={()=>{}} onDelete={()=>{}} />;
    
    if (subTab === 'NOTIFICATIONS') return (
        <Card title="Push Notifications">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Title" value={notification.title} onChange={e => setNotification({...notification, title: e.target.value})} placeholder="e.g. System Update" />
                    <Select label="Target Audience" value={notification.target} onChange={e => setNotification({...notification, target: e.target.value})}>
                        <option value="All">All Users</option>
                        <option value="Sellers">Sellers Only</option>
                        <option value="Buyers">Buyers Only</option>
                    </Select>
                </div>
                <TextArea label="Message Body" value={notification.message} onChange={e => setNotification({...notification, message: e.target.value})} placeholder="Message..." rows={3} />
                <div className="flex justify-end">
                    <Button icon={Bell} onClick={sendNotification}>Send Broadcast</Button>
                </div>
            </div>
        </Card>
    );

    if (subTab === 'INTEGRATIONS') return (
        <Card title="Third-Party Integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map(integ => (
                    <div key={integ.id} className="p-4 bg-nexus-main border border-nexus-border rounded-lg flex justify-between items-center">
                        <span className="font-bold text-white">{integ.name}</span>
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${integ.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                             <Button 
                                size="sm" 
                                variant={integ.connected ? 'danger' : 'success'} 
                                onClick={() => toggleIntegration(integ.id)}
                             >
                                 {integ.connected ? 'Disconnect' : 'Connect'}
                             </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );

    return <div>Select System Module</div>;
}
