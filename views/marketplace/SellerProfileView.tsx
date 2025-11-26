

import React from 'react';
import { User } from '../../types';
import { Badge, Card } from '../../components/UIComponents';

export const SellerProfileView: React.FC<{ seller: User; isDevMode?: boolean }> = ({ seller, isDevMode }) => {
   return (
      <div className="space-y-6">
         <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden shadow-lg">
            <div className="h-48 bg-gradient-to-r from-[#2a1b4e] to-[#120822] relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>
            <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-16 gap-8">
               <div className="relative">
                  <img src={seller.avatar} className="w-32 h-32 rounded-full border-4 border-nexus-card bg-nexus-main" alt="" />
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-nexus-card ${seller.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
               </div>
               <div className="flex-1 mb-2">
                  <h1 className="text-3xl font-black text-white">{seller.username}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                     <Badge variant="gold">Gold Seller</Badge>
                     <Badge variant="success">Verified ID</Badge>
                     <Badge variant="purple">Fast Delivery</Badge>
                  </div>
               </div>
               <div className="flex gap-8 mb-4 bg-nexus-header/50 p-4 rounded-xl border border-nexus-border backdrop-blur-sm">
                  <div className="text-center">
                     <div className="text-2xl font-black text-white">{seller.reputation}%</div>
                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Positive Feedback</div>
                  </div>
                  <div className="w-px bg-nexus-border h-10 self-center"></div>
                  <div className="text-center">
                     <div className="text-2xl font-black text-white">{seller.totalSales}</div>
                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Orders Completed</div>
                  </div>
               </div>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
               <Card title="About Seller">
                  <p className="text-sm text-gray-400 leading-relaxed">
                     Professional seller with over 5 years of experience in MMORPG markets. 
                     Specializing in high-end accounts and instant currency delivery.
                     Operating hours: 10:00 AM - 02:00 AM (EST).
                  </p>
               </Card>
            </div>
            <div className="md:col-span-2">
               <Card title="Latest Feedback">
                  <div className="text-center py-10 text-gray-500">No recent feedback visible in demo.</div>
               </Card>
            </div>
         </div>
      </div>
   )
};