
import React from 'react';
import { User, Review } from '../../types';
import { Badge, Button } from '../UIComponents';
import { CheckCircle, Star, MessageCircle, User as UserIcon, ThumbsUp, ThumbsDown } from 'lucide-react';

interface SellerInfoPanelProps {
  seller: User;
  reviews: Review[];
  onChat: () => void;
  onViewProfile: () => void;
  className?: string;
}

export const SellerInfoPanel: React.FC<SellerInfoPanelProps> = ({ seller, reviews, onChat, onViewProfile, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
        {/* Main Seller Card */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide">Seller Info</h4>
               {seller.isOnline && <Badge variant="success">Online</Badge>}
            </div>
            
            <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={onViewProfile}>
                <div className="relative">
                   <img src={seller.avatar} className="w-16 h-16 rounded-full border-2 border-nexus-border" alt="" />
                   {seller.badges.includes('verified_id') && (
                      <div className="absolute -bottom-1 -right-1 bg-nexus-primary text-white rounded-full p-1 border-2 border-nexus-card">
                         <CheckCircle size={12} />
                      </div>
                   )}
                </div>
                <div>
                   <div className="font-bold text-white text-xl hover:text-nexus-primary transition-colors">
                      {seller.username}
                   </div>
                   <div className="flex items-center text-xs text-gray-400 gap-3 mt-1">
                      <span className="flex items-center text-yellow-500 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded"><Star size={12} className="fill-yellow-500 mr-1"/> {seller.reputation}%</span>
                      <span className="bg-nexus-main px-1.5 py-0.5 rounded border border-nexus-border">Lvl {seller.kycLevel}</span>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-center text-xs text-gray-400">
                 <div className="bg-nexus-main p-2 rounded border border-nexus-border">
                     <div className="font-black text-white text-sm">{seller.totalSales}</div>
                     <div className="text-[10px] uppercase">Sales</div>
                 </div>
                 <div className="bg-nexus-main p-2 rounded border border-nexus-border">
                     <div className="font-black text-white text-sm">~15m</div>
                     <div className="text-[10px] uppercase">Delivery</div>
                 </div>
            </div>

            <div className="flex gap-2">
                <Button fullWidth variant="secondary" icon={MessageCircle} onClick={onChat} className="text-xs h-10">Chat</Button>
                <Button variant="outline" icon={UserIcon} onClick={onViewProfile} className="w-12 h-10 px-0 flex items-center justify-center"></Button>
            </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden shadow-lg">
             <div className="px-4 py-3 bg-nexus-header border-b border-nexus-border flex justify-between items-center">
                 <h4 className="text-sm font-bold text-white">Recent Feedback</h4>
                 <span className="text-xs text-nexus-primary cursor-pointer hover:underline">View All</span>
             </div>
             <div className="divide-y divide-nexus-border">
                 {reviews.length > 0 ? reviews.slice(0, 5).map(review => (
                     <div key={review.id} className="p-4 hover:bg-nexus-hover transition-colors">
                         <div className="flex justify-between items-start mb-1">
                             <div className="flex items-center gap-2">
                                 {review.rating === 'Positive' ? <ThumbsUp size={12} className="text-green-500"/> : <ThumbsDown size={12} className="text-red-500"/>}
                                 <span className="text-xs font-bold text-gray-300">{review.author}</span>
                             </div>
                             <span className="text-[10px] text-gray-500">{review.date}</span>
                         </div>
                         <p className="text-xs text-gray-400 italic">"{review.text}"</p>
                         <div className="mt-1 text-[10px] text-gray-600">for {review.itemName}</div>
                     </div>
                 )) : (
                     <div className="p-4 text-center text-xs text-gray-500">No reviews yet</div>
                 )}
             </div>
        </div>
    </div>
  );
};
