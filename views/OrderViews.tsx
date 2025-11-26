

import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, Send, XCircle, ChevronLeft, ShieldAlert, Paperclip, Clock, CheckCircle } from 'lucide-react';
import { Button, Card, Badge, Input, DevNote } from '../components/UIComponents';
import { MOCK_CHAT_HISTORY } from '../constants';
import { ChatMessage, Order, OrderStatus } from '../types';

export const OrderDetailsView: React.FC<{ onBack: () => void; isDevMode?: boolean }> = ({ onBack, isDevMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'u1',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center mb-8 text-gray-400 cursor-pointer hover:text-white group transition-colors" onClick={onBack}>
         <div className="w-8 h-8 rounded-full bg-nexus-card border border-nexus-border flex items-center justify-center mr-3 group-hover:border-nexus-primary group-hover:bg-nexus-primary/10">
            <ChevronLeft size={16} /> 
         </div>
         <span className="text-sm font-bold">Back to Dashboard</span>
      </div>

      {isDevMode && (
          <DevNote title="Backend Requirements: Real-Time Order System">
              1. <strong>WebSockets:</strong> This chat must use Socket.io to enable real-time communication between Buyer and Seller. <br/>
              2. <strong>Escrow State Machine:</strong> The `OrderStatus` state dictates the UI. Funds are LOCKED in system escrow until Buyer confirms receipt or Auto-Confirm timer expires. <br/>
              3. <strong>Dispute:</strong> If "Report" is clicked, an Admin enters this chat room.
          </DevNote>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Left Column: Order Status & Details (4 Columns) */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden shadow-lg">
               <div className="bg-red-500/10 border-b border-red-500/20 p-5">
                  <div className="flex items-center space-x-3 mb-1">
                     <XCircle className="text-red-500" size={24} />
                     <h3 className="text-red-500 font-bold text-lg">Order Cancelled</h3>
                  </div>
                  <p className="text-xs text-red-400 pl-9">Refund processed to Wallet.</p>
               </div>

               <div className="p-5 space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-nexus-border border-dashed">
                     <span className="text-gray-500">Order ID</span>
                     <span className="text-white font-mono bg-nexus-main px-2 py-0.5 rounded border border-nexus-border text-xs">#98BC4674</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-nexus-border border-dashed">
                     <span className="text-gray-500">Date</span>
                     <span className="text-white font-medium">Oct 20, 2025</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-nexus-border border-dashed">
                     <span className="text-gray-500">Total Amount</span>
                     <span className="text-nexus-primary font-black text-lg">$1.20</span>
                  </div>
                  <div className="pt-3">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">Item Purchased</span>
                     <div className="flex items-start space-x-3 bg-nexus-main/50 p-3 rounded-lg border border-nexus-border">
                        <div className="w-12 h-12 bg-gray-700 rounded-md bg-[url('https://picsum.photos/100')] bg-cover border border-nexus-border"></div>
                        <div className="flex-1 min-w-0">
                           <p className="text-white font-bold truncate">Mercury Spark - 5 Star</p>
                           <p className="text-xs text-gray-500 mt-1">Quantity: 6</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="pt-4">
                     <Button fullWidth variant="primary">Buy Again</Button>
                  </div>
               </div>
            </div>
            
            <div className="bg-[#130b24] border border-nexus-border p-5 rounded-xl">
               <h4 className="font-bold text-gray-200 text-sm mb-3 flex items-center"><ShieldAlert size={16} className="mr-2 text-nexus-primary"/> Security Reminders</h4>
               <ul className="text-xs text-gray-400 space-y-2.5">
                  <li className="flex items-start"><span className="mr-2 text-nexus-border">•</span> Never share your login credentials.</li>
                  <li className="flex items-start"><span className="mr-2 text-nexus-border">•</span> Always record your trade sessions.</li>
                  <li className="flex items-start"><span className="mr-2 text-nexus-border">•</span> Do not confirm delivery until received.</li>
               </ul>
            </div>
         </div>

         {/* Right Column: Chat System (8 Columns) */}
         <div className="lg:col-span-8 flex flex-col h-[700px] bg-nexus-card border border-nexus-border rounded-xl overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-nexus-border bg-[#130b24] flex justify-between items-center shadow-md z-10">
               <div className="flex items-center space-x-4">
                  <div className="relative">
                     <img src="https://ui-avatars.com/api/?name=Pixel+Store&background=10b981&color=fff" className="w-12 h-12 rounded-full border-2 border-nexus-border" alt="" />
                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#130b24] rounded-full"></span>
                  </div>
                  <div>
                     <h3 className="font-bold text-white text-lg">D18QUAN</h3>
                     <div className="flex items-center text-xs text-green-400 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span> Online Now
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="text-xs">View Profile</Button>
                 <Button variant="secondary" size="sm" className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10">Report</Button>
               </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0f0518] custom-scrollbar">
               {/* System Message */}
               <div className="flex justify-center">
                  <span className="text-[10px] uppercase font-bold text-gray-500 bg-nexus-card border border-nexus-border px-4 py-1.5 rounded-full tracking-wider shadow-sm">
                     Order Created • Oct 20, 10:30 AM
                  </span>
               </div>

               {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'u1' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`flex max-w-[80%] ${msg.senderId === 'u1' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0 mt-auto">
                           {msg.senderId === 'u1' ? null : (
                              <div className="w-8 h-8 rounded-full bg-nexus-hover border border-nexus-border flex items-center justify-center text-xs font-bold text-gray-400">S</div>
                           )}
                        </div>
                        
                        {/* Bubble */}
                        <div>
                           <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.senderId === 'u1' 
                              ? 'bg-nexus-primary text-white rounded-br-none' 
                              : 'bg-nexus-card border border-nexus-border text-gray-200 rounded-bl-none'
                           }`}>
                              {msg.text}
                           </div>
                           <div className={`text-[10px] text-gray-600 mt-1.5 font-medium ${msg.senderId === 'u1' ? 'text-right' : 'text-left'}`}>
                              {msg.timestamp}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
               
               <div className="flex justify-center py-4">
                  <div className="bg-red-500/5 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl text-sm flex items-center shadow-sm">
                     <AlertTriangle size={18} className="mr-3 flex-shrink-0" />
                     <span>Dispute Resolved: <strong>Buyer Refunded</strong></span>
                  </div>
               </div>
            </div>

            {/* Input Area (Disabled style for cancelled order) */}
            <div className="p-5 bg-nexus-card border-t border-nexus-border">
               <div className="relative opacity-60">
                   <div className="absolute left-4 top-3.5 text-gray-500"><Paperclip size={20} /></div>
                   <input 
                     type="text" 
                     placeholder="This conversation is closed." 
                     disabled
                     className="w-full bg-nexus-main border border-nexus-border rounded-xl pl-12 pr-12 py-3.5 text-sm text-gray-500 cursor-not-allowed font-medium"
                   />
                   <div className="absolute right-4 top-3.5 text-gray-600"><Send size={20} /></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
