

import React, { useState } from 'react';
import { ShoppingBag, Wallet, MessageSquare, Clock, CheckCircle, XCircle, ChevronRight, Plus, CreditCard } from 'lucide-react';
import { Card, Badge, Button, DevNote } from '../../components/UIComponents';
import { Order, OrderStatus } from '../../types';

export const BuyerDashboard: React.FC<{ isDevMode?: boolean }> = ({ isDevMode }) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'WALLET' | 'MESSAGES'>('ORDERS');

  // Mock active orders
  const orders: Partial<Order>[] = [
      { id: 'o1', status: OrderStatus.COMPLETED, totalPrice: 12.50, createdAt: '2025-10-24', listing: { title: '1000 V-Bucks', image: 'https://picsum.photos/200' } as any },
      { id: 'o2', status: OrderStatus.DELIVERING, totalPrice: 45.00, createdAt: '2025-10-25', listing: { title: 'Fortnite Account - Stacked', image: 'https://picsum.photos/201' } as any },
      { id: 'o3', status: OrderStatus.CANCELLED, totalPrice: 5.00, createdAt: '2025-10-20', listing: { title: 'Starter Pack', image: 'https://picsum.photos/202' } as any },
  ];

  return (
    <div className="max-w-6xl mx-auto min-h-[60vh]">
       <h1 className="text-3xl font-black text-white mb-8">Buyer Dashboard</h1>
       
       {isDevMode && (
           <DevNote title="Order State Logic">
               1. <strong>Wallet Security:</strong> Funds are held in a virtual wallet. Deposits via Stripe/Crypto should update the `walletBalance` column in DB atomically. <br/>
               2. <strong>Order Status:</strong> PENDING - DELIVERING (Money in Escrow) - COMPLETED (Money to Seller).
           </DevNote>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-2">
             <button 
                onClick={() => setActiveTab('ORDERS')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'ORDERS' ? 'bg-nexus-primary text-white shadow-lg shadow-nexus-primary/20' : 'bg-nexus-card text-gray-400 hover:text-white hover:bg-nexus-hover'}`}
             >
                <ShoppingBag size={18} className="mr-3" /> My Orders
             </button>
             <button 
                onClick={() => setActiveTab('WALLET')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'WALLET' ? 'bg-nexus-primary text-white shadow-lg shadow-nexus-primary/20' : 'bg-nexus-card text-gray-400 hover:text-white hover:bg-nexus-hover'}`}
             >
                <Wallet size={18} className="mr-3" /> Wallet
             </button>
             <button 
                onClick={() => setActiveTab('MESSAGES')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'MESSAGES' ? 'bg-nexus-primary text-white shadow-lg shadow-nexus-primary/20' : 'bg-nexus-card text-gray-400 hover:text-white hover:bg-nexus-hover'}`}
             >
                <MessageSquare size={18} className="mr-3" /> Messages
             </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
             
             {/* ORDERS TAB */}
             {activeTab === 'ORDERS' && (
                <Card title="Order History">
                   <div className="space-y-4">
                      {orders.map(order => (
                         <div key={order.id} className="bg-nexus-main border border-nexus-border rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-nexus-primary transition-colors cursor-pointer">
                            <div className="w-16 h-16 bg-gray-700 rounded-lg bg-cover bg-center flex-shrink-0" style={{backgroundImage: `url(${order.listing?.image})`}}></div>
                            <div className="flex-1 text-center md:text-left">
                               <h3 className="font-bold text-white">{order.listing?.title}</h3>
                               <p className="text-xs text-gray-500">Order #{order.id} • {order.createdAt}</p>
                            </div>
                            <div className="text-center md:text-right min-w-[100px]">
                               <div className="font-black text-white text-lg">${order.totalPrice?.toFixed(2)}</div>
                            </div>
                            <div className="min-w-[120px] flex justify-center">
                               <Badge 
                                  variant={
                                     order.status === OrderStatus.COMPLETED ? 'success' : 
                                     order.status === OrderStatus.CANCELLED ? 'danger' : 'warning'
                                  }
                                  className="py-1 px-3"
                               >
                                  {order.status === OrderStatus.COMPLETED && <CheckCircle size={12} className="mr-1" />}
                                  {order.status === OrderStatus.CANCELLED && <XCircle size={12} className="mr-1" />}
                                  {order.status === OrderStatus.DELIVERING && <Clock size={12} className="mr-1" />}
                                  {order.status}
                               </Badge>
                            </div>
                            <ChevronRight className="text-gray-600" />
                         </div>
                      ))}
                   </div>
                </Card>
             )}

             {/* WALLET TAB */}
             {activeTab === 'WALLET' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-nexus-primary to-[#4c1d95] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                         <div className="absolute right-0 top-0 p-8 opacity-10"><Wallet size={120} /></div>
                         <p className="text-purple-200 font-medium mb-1">Available Balance</p>
                         <h2 className="text-5xl font-black mb-8">$1,250.00</h2>
                         <div className="flex gap-3">
                            <Button variant="secondary" size="sm" icon={Plus} className="bg-white/20 border-transparent hover:bg-white/30 text-white">Deposit</Button>
                            <Button variant="secondary" size="sm" icon={CreditCard} className="bg-white/20 border-transparent hover:bg-white/30 text-white">Withdraw</Button>
                         </div>
                      </div>
                      
                      <Card title="Quick Actions" className="h-full">
                         <div className="space-y-3">
                            <div className="p-3 bg-nexus-main rounded border border-nexus-border flex items-center justify-between cursor-pointer hover:border-nexus-primary transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><Plus size={20}/></div>
                                  <div>
                                     <div className="font-bold text-white">Add Funds via Crypto</div>
                                     <div className="text-xs text-gray-500">0% Fees • Instant</div>
                                  </div>
                               </div>
                               <ChevronRight size={16} className="text-gray-500"/>
                            </div>
                            <div className="p-3 bg-nexus-main rounded border border-nexus-border flex items-center justify-between cursor-pointer hover:border-nexus-primary transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><CreditCard size={20}/></div>
                                  <div>
                                     <div className="font-bold text-white">Add Funds via Card</div>
                                     <div className="text-xs text-gray-500">2.5% Fee • Instant</div>
                                  </div>
                               </div>
                               <ChevronRight size={16} className="text-gray-500"/>
                            </div>
                         </div>
                      </Card>
                   </div>

                   <Card title="Recent Transactions">
                      <div className="text-center py-8 text-gray-500 text-sm">No recent transactions</div>
                   </Card>
                </div>
             )}

             {/* MESSAGES TAB */}
             {activeTab === 'MESSAGES' && (
                <Card title="Inbox">
                   <div className="space-y-2">
                      {[1, 2].map(i => (
                         <div key={i} className="p-4 hover:bg-nexus-hover rounded-xl transition-colors cursor-pointer border-b border-nexus-border last:border-0 flex items-center gap-4">
                            <div className="relative">
                               <img src={`https://ui-avatars.com/api/?name=Seller+${i}&background=random`} className="w-12 h-12 rounded-full" alt="" />
                               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-nexus-card rounded-full"></div>
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between mb-1">
                                  <h4 className="font-bold text-white">Seller_{i}</h4>
                                  <span className="text-xs text-gray-500">2 hours ago</span>
                               </div>
                               <p className="text-sm text-gray-400 truncate">Hello, are you available to trade now?</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </Card>
             )}
          </div>
       </div>
    </div>
  );
};
