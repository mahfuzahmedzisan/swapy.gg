
import React, { useState, useEffect } from 'react';
import { Card, Badge, DevNote } from '../../components/UIComponents';
import { TrendingUp, Users, AlertTriangle, Server, DollarSign, Activity, ShoppingCart, UserPlus, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MOCK_DATA = [
  { name: 'Mon', Sales: 4000, Users: 24 },
  { name: 'Tue', Sales: 3000, Users: 13 },
  { name: 'Wed', Sales: 2000, Users: 98 },
  { name: 'Thu', Sales: 2780, Users: 39 },
  { name: 'Fri', Sales: 1890, Users: 48 },
  { name: 'Sat', Sales: 2390, Users: 38 },
  { name: 'Sun', Sales: 3490, Users: 43 },
];

const MOCK_ACTIVITIES = [
    { id: 1, text: 'User Gamer123 purchased "1000 V-Bucks"', time: '2 mins ago', type: 'sale' },
    { id: 2, text: 'New seller application from "ProBooster"', time: '15 mins ago', type: 'alert' },
    { id: 3, text: 'System backup completed successfully', time: '1 hour ago', type: 'system' },
    { id: 4, text: 'User Xx_Shadow_xX registered', time: '2 hours ago', type: 'user' },
    { id: 5, text: 'Failed login attempt from IP 192.168.1.1', time: '3 hours ago', type: 'security' }
];

export const DashboardModule = () => {
    // Live feed simulation
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);

    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                { text: 'New order #9921 placed', type: 'sale' },
                { text: 'User Logged in', type: 'user' },
                { text: 'Payment Processed ($45.00)', type: 'sale' }
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const newActivity = {
                id: Date.now(),
                text: randomAction.text,
                time: 'Just now',
                type: randomAction.type
            };
            setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
        }, 8000); // Add new item every 8s
        return () => clearInterval(interval);
    }, []);

    const getIcon = (type: string) => {
        switch(type) {
            case 'sale': return <ShoppingCart size={14} className="text-green-400"/>;
            case 'alert': return <AlertTriangle size={14} className="text-yellow-400"/>;
            case 'user': return <UserPlus size={14} className="text-blue-400"/>;
            case 'security': return <Lock size={14} className="text-red-400"/>;
            default: return <Server size={14} className="text-gray-400"/>;
        }
    }

    return (
     <div className="space-y-8 animate-fade-in">
        <h2 className="text-3xl font-black text-white">System Dashboard</h2>
        
        <DevNote title="Data Aggregation Strategy">
            <strong>1. Materialized Views:</strong> For the 'Revenue' and 'User Growth' charts, do NOT run raw aggregations on the `orders` table every page load. Use a materialized view or a separate `analytics_daily` table updated via cron jobs or triggers. <br/>
            <strong>2. Caching:</strong> Cache dashboard stats in Redis for 5-10 minutes. Only 'Live Activity' needs real-time fetch.
        </DevNote>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <Card className="bg-gradient-to-br from-nexus-primary/20 to-nexus-card border-nexus-primary/30 relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-10"><DollarSign size={80}/></div>
              <div className="text-gray-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><TrendingUp size={14} className="text-green-400"/> Total Revenue</div>
              <div className="text-4xl font-black text-white">$124,590</div>
              <div className="text-xs text-green-400 mt-1 font-medium">+15% vs last month</div>
           </Card>
           <Card>
              <div className="text-gray-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Users size={14}/> Total Users</div>
              <div className="text-3xl font-black text-white">2,492</div>
              <div className="text-xs text-gray-500 mt-1">12 new today</div>
           </Card>
           <Card>
              <div className="text-gray-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><AlertTriangle size={14} className="text-yellow-500"/> Action Items</div>
              <div className="text-3xl font-black text-white">7</div>
              <div className="text-xs text-yellow-500 mt-1">Pending Requests</div>
           </Card>
           <Card>
              <div className="text-gray-400 text-xs font-bold uppercase mb-2 flex items-center gap-2"><Server size={14}/> System Status</div>
              <div className="text-3xl font-black text-green-400">99.9%</div>
              <div className="text-xs text-gray-500 mt-1">All systems operational</div>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card title="Revenue Analytics">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_DATA}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip contentStyle={{backgroundColor: '#1b142d', border: '1px solid #2f264a'}} />
                                <Area type="monotone" dataKey="Sales" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="User Growth">
                     <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_DATA}>
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <Tooltip contentStyle={{backgroundColor: '#1b142d', border: '1px solid #2f264a'}} />
                                <Bar dataKey="Users" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            
            <div className="lg:col-span-1">
                <Card title="Live Activity Feed" className="h-full max-h-[600px] overflow-hidden flex flex-col">
                    <DevNote title="WebSocket Feed">
                        Subscribe to `system_events` channel on Socket.io. Push events for: New Order, User Registration, Ticket Created, System Alert.
                    </DevNote>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {activities.map(activity => (
                            <div key={activity.id} className="flex gap-3 items-start animate-fade-in">
                                <div className="mt-1 p-1.5 rounded-full bg-nexus-main border border-nexus-border">
                                    {getIcon(activity.type)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300 leading-tight">{activity.text}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
     </div>
    );
};
