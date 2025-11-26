
import React from 'react';
import { Listing, Platform } from '../../types';
import { Badge, Button, TagPill } from '../UIComponents';
import { Zap, Globe, Star, ThumbsUp } from 'lucide-react';

interface AccountListingRowProps {
  listing: Listing;
  platforms: Platform[];
  onClick: () => void;
}

export const AccountListingRow: React.FC<AccountListingRowProps> = ({ listing, platforms, onClick }) => {
  const platform = platforms.find(p => p.id === listing.platformId);

  return (
    <div 
      className="bg-nexus-card border border-nexus-border rounded-xl flex flex-col md:flex-row hover:border-nexus-primary/50 transition-all cursor-pointer group shadow-lg overflow-hidden md:h-[180px]"
      onClick={onClick}
    >
      {/* 1. Image Thumbnail (Left) - Exact width/ratio */}
      <div className="w-full md:w-[320px] flex-shrink-0 relative overflow-hidden bg-black">
        <img 
          src={listing.image || 'https://picsum.photos/400/300'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
          alt={listing.title} 
        />
        {/* Gradient overlay for text readability if needed, but reference shows clean image */}
      </div>

      {/* 2. Details (Middle) - Spaced out */}
      <div className="flex-1 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-nexus-border bg-[#130b24]">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-nexus-primary transition-colors mb-3 line-clamp-1">
             {listing.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 items-center mb-4">
             {listing.deliveryType === 'Instant' && (
                <Badge variant="instant">
                   <Zap size={10} className="mr-1 fill-[#fbbf24] text-[#fbbf24]"/> INSTANT DELIVERY
                </Badge>
             )}
             {listing.tags.map(tag => (
                <TagPill key={tag} text={tag} />
             ))}
          </div>
        </div>

        {/* Seller Row */}
        <div className="flex items-center gap-3 mt-auto">
           <div className="w-8 h-8 rounded-full bg-nexus-primary text-white flex items-center justify-center font-bold text-xs">
              {listing.seller.username[0]}
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-white">{listing.seller.username}</span>
                 {listing.seller.badges.includes('verified_id') && <Star size={12} className="text-nexus-primary fill-nexus-primary" />}
              </div>
              <div className="flex items-center text-[10px] text-gray-400">
                 <Star size={10} className="text-yellow-500 fill-yellow-500 mr-1"/>
                 <span className="text-gray-300 mr-1">99.3% Positive</span>
              </div>
           </div>
           {platform && (
              <div className="ml-auto flex items-center text-xs text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">
                 <Globe size={12} className="mr-1.5"/> {platform.name}
              </div>
           )}
        </div>
      </div>

      {/* 3. Action (Right) - Price and Button */}
      <div className="w-full md:w-[220px] flex-shrink-0 bg-[#0f0518] flex flex-row md:flex-col items-center justify-between md:justify-center p-6 gap-4 border-l border-nexus-border">
         <div className="text-left md:text-center">
            <div className="text-3xl font-black text-white tracking-tight">${listing.price.toFixed(2)}</div>
         </div>
         <Button variant="gradient" size="md" className="w-auto md:w-full shadow-lg">
            View Offer
         </Button>
      </div>
    </div>
  );
};
