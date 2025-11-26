

import React from 'react';
import { Listing } from '../../types';
import { Zap, Flame, Code } from 'lucide-react';

interface GiftCardListingItemProps {
  listing: Listing;
  onClick: () => void;
  selected?: boolean;
}

export const GiftCardListingItem: React.FC<GiftCardListingItemProps> = ({ listing, onClick, selected }) => {
  // 1. Determine Subtitle (Unit)
  // We use the configured unit/subtitle. If it's generic 'Unit' or 'Card', we hide it visually (set to empty string) 
  // unless we want to force it, but for logic we treat it as non-existent.
  const rawSubtitle = listing.unit;
  const hasValidSubtitle = rawSubtitle && rawSubtitle !== 'Unit' && rawSubtitle !== 'Card';
  const subTitleDisplay = hasValidSubtitle ? rawSubtitle : '';

  // 2. Determine Main Display Value (Title)
  let displayValue = listing.title;

  // Smart Cleanup: If the title contains the subtitle (e.g. Title: "1000 V-Bucks", Subtitle: "V-Bucks"),
  // remove the subtitle from the title to show a clean "1000".
  // If Title is "1 Month" and Subtitle is empty, it stays "1 Month".
  if (hasValidSubtitle) {
     // Escape special regex characters in subtitle just in case
     const escapedSubtitle = rawSubtitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const regex = new RegExp(escapedSubtitle, 'gi'); // Case insensitive removal
     const cleaned = displayValue.replace(regex, '').trim();
     
     // Only update if the cleaned version isn't empty (e.g. don't make Title "" if Title was just "V-Bucks")
     if (cleaned.length > 0) {
         displayValue = cleaned;
     }
  }

  // 3. Dynamic Font Sizing based on character length
  const getFontSize = (text: string) => {
      if (text.length <= 5) return 'text-3xl'; // e.g. "1000", "100"
      if (text.length <= 10) return 'text-2xl'; // e.g. "1 Month"
      return 'text-lg'; // e.g. "Season Pass"
  };

  const fontSizeClass = getFontSize(displayValue);

  // Automatic "Popular" logic (Mock: if price > 20 and < 80)
  const isPopular = listing.price > 20 && listing.price < 80;

  return (
    <div 
      onClick={onClick}
      className={`relative bg-nexus-card border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col h-40 shadow-lg ${
         selected 
         ? 'border-nexus-primary ring-2 ring-nexus-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-nexus-primary/5' 
         : 'border-nexus-border hover:border-gray-500 hover:-translate-y-1'
      }`}
    >
        {/* Popular Badge */}
        {isPopular && (
            <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 flex items-center gap-1">
                <Flame size={10} fill="currentColor"/> Popular
            </div>
        )}

        {/* Instant Delivery Icon */}
        {listing.deliveryType === 'Instant' && !isPopular && (
             <div className="absolute top-2 right-2 text-nexus-gold z-20 bg-black/40 rounded-full p-1">
                  <Zap size={12} fill="currentColor" />
             </div>
        )}

        {/* Background Image Effect */}
        <div className="absolute inset-0 z-0">
             {listing.image ? (
                 <img src={listing.image} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
             ) : (
                 <div className="w-full h-full bg-nexus-main"></div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-nexus-card via-nexus-card/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
            
            {/* Small Image Icon */}
            {listing.image && (
                <img src={listing.image} alt="icon" className="w-8 h-8 rounded-full mb-2 object-cover border border-white/10 shadow-md" />
            )}

            <div className={`font-black text-white tracking-tight leading-none mb-1 group-hover:text-nexus-primary transition-colors drop-shadow-sm ${fontSizeClass}`}>
                {displayValue}
            </div>
            
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 h-4">
                {subTitleDisplay}
            </div>
            
            {/* Price Tag */}
             <div className="bg-[#150d22]/80 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full">
                <div className="text-sm font-bold text-white">
                   ${listing.price.toFixed(2)}
                </div>
            </div>
        </div>
    </div>
  );
};
