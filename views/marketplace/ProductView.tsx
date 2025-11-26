

import React, { useState } from 'react';
import { 
  Globe, Clock, Shield, Info
} from 'lucide-react';
import { Listing, Platform } from '../../types';
import { Badge, Button, Card, Breadcrumbs, DevNote } from '../../components/UIComponents';
import { MOCK_REVIEWS, GAMES } from '../../data/mockData';
import { SellerInfoPanel } from '../../components/listings/SellerInfoPanel';

interface ProductViewProps {
  listing: Listing;
  listings: Listing[];
  platforms: Platform[];
  onNavigate: (view: any, data?: any) => void;
  isDevMode?: boolean;
}

export const ProductView: React.FC<ProductViewProps> = ({ listing, listings, platforms, onNavigate, isDevMode }) => {
  const [qty, setQty] = useState(listing.minQty);
  const platform = platforms.find(p => p.id === listing.platformId);
  const otherSellers = listings.filter(l => l.id !== listing.id && l.gameId === listing.gameId).slice(0, 4); 
  
  // Find Config to display labels properly
  const game = GAMES.find(g => g.id === listing.gameId);
  const config = game?.categoryConfigs?.[listing.categoryId];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start pb-10">
      {/* Left Column: Details */}
      <div className="flex-1 w-full space-y-8">
        <Breadcrumbs items={['Home', game?.name || 'Game', 'Offers', listing.title]} />
        
        {isDevMode && (
            <DevNote title="Dynamic Attribute Rendering">
                The "Specifications" section below is NOT hardcoded. <br/>
                It iterates through `game.categoryConfigs.listingFields` and checks if `listing.customValues` contains data for that field ID.
                <br/>
                Example: If config has "Region" field, and listing has `customValues['region'] = 'EU'`, it renders the box.
            </DevNote>
        )}

        <div className="bg-nexus-card border border-nexus-border rounded-2xl relative overflow-hidden shadow-xl">
           {/* Header Image (Admin Configurable) */}
           <div className="h-48 md:h-64 relative bg-black">
               <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{backgroundImage: `url(${game?.detailImage || game?.image})`}}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-nexus-card to-transparent"></div>
               <div className="absolute bottom-6 left-8 right-8">
                   <div className="flex flex-wrap gap-2 mb-3">
                        {platform && <Badge variant="purple" className="flex items-center gap-1 py-1 px-3 text-xs"><Globe size={12}/> {platform.name}</Badge>}
                        <Badge variant={listing.deliveryType === 'Instant' ? 'success' : 'warning'} className="py-1 px-3 text-xs">{listing.deliveryType} Delivery</Badge>
                   </div>
                   <h1 className="text-3xl md:text-4xl font-black text-white leading-tight shadow-sm">{listing.title}</h1>
               </div>
           </div>

           <div className="p-8">
              {/* Product Specifications Section (Dynamic Attributes) */}
              {config && config.listingFields.length > 0 && listing.customValues && (
                  <div className="mb-8 p-6 bg-[#130b24] rounded-xl border border-nexus-border">
                      <h3 className="text-white font-bold text-lg mb-4 flex items-center"><Info size={18} className="mr-2 text-nexus-primary"/> Specifications</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {config.listingFields.map(field => {
                              const val = listing.customValues?.[field.id];
                              // Show even if falsy (like 0), but not if undefined
                              if (val === undefined || val === null || val === '') return null;
                              return (
                                  <div key={field.id} className="bg-nexus-main border border-nexus-border p-3 rounded-lg flex flex-col justify-center">
                                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wide">{field.label}</div>
                                      <div className="text-sm font-bold text-white">{val}</div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              )}

              <div className="prose prose-invert max-w-none text-gray-300">
                 <h3 className="text-white font-bold text-lg mb-3">Description</h3>
                 <div className="bg-nexus-main/50 rounded-xl p-5 border border-nexus-border">
                    <p className="whitespace-pre-line leading-relaxed text-sm text-gray-300">{listing.description}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Other Sellers Section */}
        <div className="pt-4">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white text-xl">Other Offers</h3>
              <button className="text-xs text-nexus-primary font-bold uppercase hover:text-white">View All</button>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherSellers.map(l => (
                 <div key={l.id} className="bg-nexus-card border border-nexus-border rounded-xl p-4 hover:border-nexus-primary cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => onNavigate('PRODUCT', l)}>
                    <div className="flex justify-between items-start mb-3">
                       <div>
                          <span className="font-black text-white text-lg block">${l.price}</span>
                          <span className="text-[10px] text-gray-500">per unit</span>
                       </div>
                       {l.seller.isOnline && <Badge variant="success" className="scale-75 origin-top-right">Online</Badge>}
                    </div>
                    <div className="text-xs text-gray-300 font-medium truncate mb-3">{l.title}</div>
                    <div className="flex items-center pt-3 border-t border-nexus-border text-[10px] text-gray-500">
                       <img src={l.seller.avatar} className="w-4 h-4 rounded-full mr-2" alt="" />
                       {l.seller.username}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Right Column: Sticky Sidebar */}
      <div className="w-full lg:w-[400px] flex-shrink-0 sticky top-24 space-y-6">
         
         {/* 1. Buy Box */}
         <Card className="shadow-[0_0_40px_rgba(0,0,0,0.3)] border-t-4 border-t-nexus-primary" noPadding>
            <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Price</span>
                  <div className="text-right">
                     <span className="text-4xl font-black text-white">${(listing.price * qty).toFixed(2)}</span>
                  </div>
               </div>

               <div className="space-y-6">
                  {/* Quantity Input */}
                  <div className="bg-nexus-main rounded-xl p-4 border border-nexus-border">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Quantity</label>
                        <span className="text-xs text-green-400 font-medium">{listing.stock} units available</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <button 
                           onClick={() => setQty(Math.max(listing.minQty, qty - 1))}
                           className="w-10 h-10 rounded-lg bg-nexus-header border border-nexus-border text-white hover:border-nexus-primary hover:text-nexus-primary transition-colors flex items-center justify-center text-xl font-bold"
                        >-</button>
                        <input 
                           type="number" 
                           value={qty} 
                           onChange={(e) => setQty(Number(e.target.value))}
                           className="flex-1 bg-transparent text-center font-mono font-bold text-xl text-white focus:outline-none"
                           min={listing.minQty}
                           max={listing.stock}
                        />
                        <button 
                           onClick={() => setQty(Math.min(listing.stock, qty + 1))}
                           className="w-10 h-10 rounded-lg bg-nexus-header border border-nexus-border text-white hover:border-nexus-primary hover:text-nexus-primary transition-colors flex items-center justify-center text-xl font-bold"
                        >+</button>
                     </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center"><Clock size={14} className="mr-2"/> Delivery Time</span>
                        <span className="text-white font-bold">{listing.deliveryTime}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center"><Shield size={14} className="mr-2"/> Protection</span>
                        <span className="text-green-400 font-bold">Standard Warranty</span>
                     </div>
                  </div>

                  <Button fullWidth size="lg" className="h-14 text-lg font-black uppercase tracking-wide rounded-xl" onClick={() => onNavigate('CHECKOUT')}>
                     Buy Now
                  </Button>
               </div>
            </div>
         </Card>

         {/* 2. Reusable Seller Profile Panel */}
         <SellerInfoPanel 
             seller={listing.seller}
             reviews={MOCK_REVIEWS} // Using mock reviews
             onChat={() => alert("Chat opened!")}
             onViewProfile={() => onNavigate('SELLER_PROFILE', listing.seller)}
         />
      </div>
    </div>
  );
};
