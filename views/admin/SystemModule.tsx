
import React, { useState } from 'react';
import { GenericModule } from '../../components/AdminUI';
import { SystemLog, ApiKey, Webhook, Plugin, Backup, CronJob } from '../../types';
import { Badge } from '../../components/UIComponents';

export const SystemModule: React.FC<{ subTab: string }> = ({ subTab }) => {
    
    // MOCK DATA
    const [logs] = useState<SystemLog[]>([{ id: 'l1', action: 'User Login', admin: 'System', ip: '127.0.0.1', timestamp: '2025-10-25', level: 'Info' }]);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([{ id: 'k1', key: 'sk_live_...9f2a', service: 'Stripe', lastUsed: 'Just now' }]);
    const [webhooks, setWebhooks] = useState<Webhook[]>([{ id: 'w1', url: 'https://site.com/callback', events: ['order.created'], status: 'Active' }]);
    const [plugins, setPlugins] = useState<Plugin[]>([{ id: 'pl1', name: 'Google Analytics', version: '4.0', status: 'Active' }]);
    const [backups] = useState<Backup[]>([{ id: 'b1', filename: 'db_snap_01.sql', size: '45MB', date: 'Yesterday' }]);
    const [cron] = useState<CronJob[]>([{ id: 'c1', name: 'Payout Processor', schedule: '0 0 * * *', lastRun: 'Success', status: 'Success' }]);

    const handleSave = (setter: any, list: any[]) => (item: any) => {
        if (list.find(i => i.id === item.id)) setter(list.map(i => i.id === item.id ? item : i));
        else setter([...list, item]);
    };
    const handleDelete = (setter: any, list: any[]) => (id: string) => setter(list.filter(i => i.id !== id));

    // SYSTEM
    if (subTab === 'LOGS') return <GenericModule<SystemLog> title="System Logs" data={logs} columns={[{key:'timestamp', label:'Time'}, {key:'level', label:'Level', render: l=><Badge variant={l.level==='Error'?'danger':'success'}>{l.level}</Badge>}, {key:'action', label:'Action'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />;
    if (subTab === 'DATABASE') return <div className="p-4 text-green-400 font-mono">Database Connection: OK (Latency: 5ms)</div>;
    if (subTab === 'CACHE') return <div className="p-4 text-white"><button className="bg-red-500 px-4 py-2 rounded">Flush Redis</button></div>;
    if (subTab === 'BACKUPS') return <GenericModule<Backup> title="Backups" data={backups} columns={[{key:'filename', label:'File'}, {key:'size', label:'Size'}, {key:'date', label:'Date'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />;
    if (subTab === 'CRON') return <GenericModule<CronJob> title="Cron Jobs" data={cron} columns={[{key:'name', label:'Job'}, {key:'schedule', label:'Schedule'}, {key:'status', label:'Last Status'}]} fields={[]} onSave={()=>{}} onDelete={()=>{}} />;
    if (subTab === 'SECURITY') return <div className="p-4 text-white">Security Settings (2FA, Password Policy)</div>;
    if (subTab === 'MAINTENANCE') return <div className="p-4 text-white">Maintenance Mode: <Badge variant="danger">OFF</Badge></div>;
    if (subTab === 'SYSTEM_INFO') return <div className="p-4 text-white font-mono">Node v18.16.0 | Memory: 512MB/2048MB</div>;

    // DEV
    if (subTab === 'DEVELOPERS') return <GenericModule<ApiKey> title="API Keys" data={apiKeys} columns={[{key:'service', label:'Service'}, {key:'key', label:'Key'}, {key:'lastUsed', label:'Last Used'}]} fields={[{key:'service', label:'Service Name', type:'text'}, {key:'key', label:'Key Value', type:'text'}]} onSave={handleSave(setApiKeys, apiKeys)} onDelete={handleDelete(setApiKeys, apiKeys)} />;
    if (subTab === 'WEBHOOKS') return <GenericModule<Webhook> title="Webhooks" data={webhooks} columns={[{key:'url', label:'URL'}, {key:'status', label:'Status'}]} fields={[{key:'url', label:'Endpoint URL', type:'text'}]} onSave={handleSave(setWebhooks, webhooks)} onDelete={handleDelete(setWebhooks, webhooks)} />;
    if (subTab === 'PLUGINS') return <GenericModule<Plugin> title="Plugins" data={plugins} columns={[{key:'name', label:'Plugin'}, {key:'version', label:'Ver'}, {key:'status', label:'Status'}]} fields={[]} onSave={handleSave(setPlugins, plugins)} onDelete={handleDelete(setPlugins, plugins)} />;
    
    // Other
    if (subTab === 'IP_WHITELIST') return <GenericModule title="IP Whitelist" data={[{id:'ip1', ip:'127.0.0.1'}]} columns={[{key:'ip', label:'IP Address'}]} fields={[{key:'ip', label:'IP', type:'text'}]} onSave={()=>{}} onDelete={()=>{}} />;
    if (subTab === 'SMS') return <div className="p-4 text-white">SMS Gateway Config (Twilio)</div>;
    if (subTab === 'NOTIFICATIONS') return <div className="p-4 text-white">Push Notification Config (Firebase)</div>;
    if (subTab === 'INTEGRATIONS') return <div className="p-4 text-white">3rd Party Integrations (Slack, Discord)</div>;
    if (subTab === 'AUDIT') return <div className="p-4 text-white">Audit Trail (Admin Actions)</div>;
    if (subTab === 'TASKS') return <div className="p-4 text-white">Admin To-Do List</div>;

    return <div>Select System Module</div>;
}
