
import React from 'react';
import { Listing, Platform, CustomFieldConfig } from '../../types';
import { Badge } from '../UIComponents';
import { Zap, Globe, ThumbsUp } from 'lucide-react';

interface AccountListingGridCardProps {
  listing: Listing;
  platforms: Platform[];
  fields?: CustomFieldConfig[]; // New prop to know what to display
  onClick: () => void;
}

export const AccountListingGridCard: React.FC<AccountListingGridCardProps> = ({ listing, platforms, fields = [], onClick }) => {
  const platform = platforms.find(p => p.id === listing.platformId);

  // Extract the first 3 relevant custom values to display as "tags"
  const displayAttributes = fields.slice(0, 3).map(field => {
      const val = listing.customValues?.[field.id];
      if(!val) return null;
      return { label: field.label, value: val };
  }).filter(Boolean);

  return (
    <div 
      className="bg-nexus-card border border-nexus-border rounded-xl hover:border-nexus-primary/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden"
      onClick={onClick}
    >
      {/* Image Background Header */}
      <div className="h-28 relative bg-black/50">
          <img src={listing.image || 'https://picsum.photos/300/150'} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-card to-transparent"></div>
          
          <div className="absolute top-3 left-3 flex gap-2">
            {platform && (
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded flex items-center text-[10px] font-bold text-gray-200 uppercase tracking-wider">
                    <Globe size={10} className="mr-1.5"/> {platform.name}
                </div>
            )}
          </div>
          
          <div className="absolute top-3 right-3">
            {listing.deliveryType === 'Instant' && (
                <div className="flex items-center text-[10px] font-bold text-nexus-gold bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-yellow-500/30">
                    <Zap size={10} className="mr-1 fill-nexus-gold"/> INSTANT
                </div>
            )}
          </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-6 relative z-10">
         <h3 className="text-base font-bold text-white group-hover:text-nexus-primary transition-colors mb-3 leading-snug line-clamp-2 min-h-[40px]">
            {listing.title}
         </h3>
         
         {/* Dynamic Attributes Grid */}
         {displayAttributes.length > 0 ? (
             <div className="grid grid-cols-2 gap-2 mb-3">
                 {displayAttributes.map((attr, idx) => (
                    <div key={idx} className="bg-[#150d22] border border-[#2f264a] rounded px-2 py-1 flex flex-col justify-center">
                        <span className="text-[9px] text-gray-500 uppercase font-bold">{attr?.label}</span>
                        <span className="text-xs text-gray-200 font-medium truncate">{attr?.value}</span>
                    </div>
                 ))}
             </div>
         ) : (
             // Fallback to tags if no config
             <div className="flex flex-wrap gap-2 mb-3 h-[50px]">
                {listing.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-[#1a1225] border border-nexus-border text-[10px] text-gray-400 font-medium h-fit">
                        {tag}
                    </span>
                ))}
             </div>
         )}
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-3 border-t border-nexus-border bg-[#130b24]/50 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="relative">
                <img src={listing.seller.avatar} className="w-6 h-6 rounded-full border border-nexus-border bg-nexus-main" alt="" />
                {listing.seller.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border border-nexus-card"></div>}
            </div>
            <div className="text-[11px] font-bold text-gray-400 hover:text-white">{listing.seller.username}</div>
         </div>

         <div className="text-xl font-black text-white tracking-tight">${listing.price.toFixed(2)}</div>
      </div>
    </div>
  );
};
