

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Clock, Shield, CheckCircle
} from 'lucide-react';
import { Game, Listing, Category, Platform, PlatformGroup } from '../../types';
import { Badge, Button, Breadcrumbs, Accordion, Checkbox, Card, DevNote } from '../../components/UIComponents';
import { AccountListingGridCard } from '../../components/listings/AccountListingGridCard';
import { GiftCardListingItem } from '../../components/listings/GiftCardListingItem';
import { SellerInfoPanel } from '../../components/listings/SellerInfoPanel';
import { MOCK_REVIEWS } from '../../data/mockData';
import { Gift } from 'lucide-react';

interface ListingsViewProps {
   onNavigate: (view: any, data?: any) => void;
   gameId?: string;
   category?: Category;
   games: Game[];
   platformGroups: PlatformGroup[];
   platforms: Platform[];
   listings: Listing[];
   isDevMode?: boolean;
}

export const ListingsView: React.FC<ListingsViewProps> = ({ onNavigate, gameId, category, games, platformGroups, platforms, listings, isDevMode }) => {
  const selectedGame = games.find(g => g.id === gameId);
  const gameName = selectedGame ? selectedGame.name : 'All Games';
  
  const baseListings = listings.filter(l => 
     (gameId ? l.gameId === gameId : true) && 
     (category ? l.categoryId === category.id : true)
  );

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isOnlineOnly, setIsOnlineOnly] = useState(false);
  const [isInstantOnly, setIsInstantOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [customFilters, setCustomFilters] = useState<Record<string, any>>({});
  
  // GIFT CARD SPLIT VIEW STATE
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null); // Specific offer selected from "Other Sellers"

  const gameCategoryConfig = (selectedGame && category) ? selectedGame.categoryConfigs?.[category.id] : null;
  const filterableFields = gameCategoryConfig?.listingFields.filter(f => f.filterType && f.filterType !== 'none') || [];

  useEffect(() => {
      setCustomFilters({});
      setSelectedPlatforms([]);
      setSelectedVariantId(null);
      setSelectedOfferId(null);
  }, [category?.id, gameId]);

  const filteredListings = baseListings.filter(l => {
     if (selectedPlatforms.length > 0 && l.platformId && !selectedPlatforms.includes(l.platformId)) return false;
     if (isOnlineOnly && !l.seller.isOnline) return false;
     if (isInstantOnly && l.deliveryType !== 'Instant') return false;
     
     if (priceRange.min && l.price < Number(priceRange.min)) return false;
     if (priceRange.max && l.price > Number(priceRange.max)) return false;

     for (const field of filterableFields) {
         const filterValue = customFilters[field.id];
         const itemValue = l.customValues?.[field.id];

         if (!filterValue) continue;

         if (field.filterType === 'select') {
             if (filterValue && filterValue !== 'All' && itemValue !== filterValue) return false;
         } else if (field.filterType === 'range') {
             const numVal = Number(itemValue);
             if (filterValue.min !== undefined && filterValue.min !== '' && numVal < Number(filterValue.min)) return false;
             if (filterValue.max !== undefined && filterValue.max !== '' && numVal > Number(filterValue.max)) return false;
         }
     }
     return true;
  });

  const handleRangeChange = (fieldId: string, type: 'min' | 'max', value: string) => {
      setCustomFilters(prev => ({
          ...prev,
          [fieldId]: { ...prev[fieldId], [type]: value }
      }));
  };

  const togglePlatform = (pid: string) => {
     setSelectedPlatforms(prev => prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]);
  }

  const platformGroup = platformGroups.find(pg => pg.id === selectedGame?.platformGroupId);
  const availablePlatforms = platformGroup 
    ? platforms.filter(p => platformGroup.platformIds.includes(p.id))
    : [];

  const isGiftCardLayout = category?.layout === 'GROUPED_GIFT_CARD';

  // --- GIFT CARD LOGIC ---
  const variants = isGiftCardLayout ? Array.from(new Set(filteredListings.map(l => l.title))).map(title => {
      const variantListings = filteredListings.filter(l => l.title === title);
      const lowestPrice = Math.min(...variantListings.map(l => l.price));
      return {
          title: title,
          lowestPrice: lowestPrice,
          listings: variantListings.sort((a,b) => a.price - b.price), // Sorted by price asc
          unit: variantListings[0].unit
      };
  }).sort((a, b) => a.lowestPrice - b.lowestPrice) : [];

  useEffect(() => {
      if (isGiftCardLayout && variants.length > 0 && !selectedVariantId) {
          setSelectedVariantId(variants[0].title);
          setSelectedOfferId(null);
      }
  }, [isGiftCardLayout, variants]);

  const activeVariant = variants.find(v => v.title === selectedVariantId);
  const bestOffer = activeVariant?.listings[0];
  
  // If a specific offer is selected from the table, show that. Otherwise show the best offer.
  const currentDisplayOffer = selectedOfferId 
    ? activeVariant?.listings.find(l => l.id === selectedOfferId) || bestOffer
    : bestOffer;

  const otherOffers = activeVariant?.listings.filter(l => l.id !== currentDisplayOffer?.id) || [];

  return (
    <div className="max-w-[1400px] mx-auto min-h-[80vh]">
       <Breadcrumbs items={['Home', gameName, category?.name || 'Browse']} />
       
       <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
             <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                {gameName} <span className="text-nexus-primary">{category?.name}</span>
             </h1>
             <p className="text-sm text-gray-400">Find the best deals on {category?.name.toLowerCase()}. {filteredListings.length} active offers.</p>
          </div>
       </div>

       {/* --- GIFT CARD SPECIAL LAYOUT (MASTER-DETAIL) --- */}
       {isGiftCardLayout ? (
           <div className="space-y-8">
               {isDevMode && (
                   <DevNote title="Frontend Logic: Master-Detail View">
                       1. <strong>Grouping Strategy:</strong> The code groups raw listings by their Title/Variant. If 50 sellers have "1000 V-Bucks", it creates 1 single card on the left. <br/>
                       2. <strong>Best Price Selection:</strong> When a group is clicked, the backend query should return the lowest price listing by default (`orderBy: price ASC`). <br/>
                       3. <strong>Instant State Update:</strong> Clicking "View" in the table below updates the `currentDisplayOffer` state, re-rendering the right panel instantly without a page reload.
                   </DevNote>
               )}

               {/* Top Filters */}
               <div className="flex gap-4 overflow-x-auto pb-2">
                   <div className="bg-nexus-card border border-nexus-border rounded-lg p-2 min-w-[150px]">
                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Region</div>
                       <select className="bg-transparent text-white text-sm font-bold w-full outline-none"><option>Global</option></select>
                   </div>
                   <div className="bg-nexus-card border border-nexus-border rounded-lg p-2 min-w-[150px]">
                       <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Platform</div>
                        <select className="bg-transparent text-white text-sm font-bold w-full outline-none"><option>All Platforms</option></select>
                   </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   {/* LEFT: Variants Grid (Master) */}
                   <div className="lg:col-span-7">
                       <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Gift size={18}/> Select Amount</h3>
                       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                           {variants.map(variant => (
                               <GiftCardListingItem 
                                    key={variant.title} 
                                    listing={variant.listings[0]}
                                    selected={selectedVariantId === variant.title}
                                    onClick={() => { setSelectedVariantId(variant.title); setSelectedOfferId(null); }}
                               />
                           ))}
                       </div>
                   </div>

                   {/* RIGHT: Best Offer Panel + Seller Info (Detail) */}
                   <div className="lg:col-span-5">
                       {currentDisplayOffer ? (
                           <div className="space-y-6 sticky top-24">
                               {/* Best Offer Card */}
                               <div className="bg-nexus-card border border-nexus-border rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Gift size={100} /></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-white">{currentDisplayOffer.title}</h2>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {currentDisplayOffer.id === bestOffer?.id && <Badge variant="success">Best Price</Badge>}
                                                    {currentDisplayOffer.deliveryType === 'Instant' && <Badge variant="instant">Instant Delivery</Badge>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-4xl font-black text-white">${currentDisplayOffer.price.toFixed(2)}</div>
                                                <div className="text-xs text-gray-400">USD</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400 flex items-center"><Clock size={14} className="mr-2"/> Delivery Time</span>
                                                <span className="text-white font-bold">{currentDisplayOffer.deliveryTime}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-400 flex items-center"><Shield size={14} className="mr-2"/> Protection</span>
                                                <span className="text-green-400 font-bold">100% Guaranteed</span>
                                            </div>
                                        </div>

                                        <Button fullWidth size="lg" className="h-12 text-lg font-bold" onClick={() => onNavigate('PRODUCT', currentDisplayOffer)}>
                                            Buy Now
                                        </Button>
                                    </div>
                               </div>

                               {/* Seller Info Panel (Identical to Product View) */}
                               <SellerInfoPanel 
                                    seller={currentDisplayOffer.seller} 
                                    reviews={MOCK_REVIEWS} 
                                    onChat={() => alert("Chat")} 
                                    onViewProfile={() => onNavigate('SELLER_PROFILE', currentDisplayOffer.seller)}
                               />
                           </div>
                       ) : (
                           <div className="h-full flex items-center justify-center text-gray-500">Select a card to view details</div>
                       )}
                   </div>
               </div>

               {/* BOTTOM: Other Sellers */}
               {activeVariant && (
                   <div className="mt-12 pt-8 border-t border-nexus-border">
                       <h3 className="text-xl font-bold text-white mb-6">Other sellers for {activeVariant.title}</h3>
                       <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden">
                           <table className="w-full text-left text-sm text-gray-400">
                               <thead className="bg-nexus-header text-xs uppercase font-bold text-gray-500">
                                   <tr>
                                       <th className="px-6 py-4">Seller</th>
                                       <th className="px-6 py-4">Rating</th>
                                       <th className="px-6 py-4">Delivery</th>
                                       <th className="px-6 py-4">Stock</th>
                                       <th className="px-6 py-4 text-right">Price</th>
                                       <th className="px-6 py-4"></th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-nexus-border">
                                   {/* Include the currently selected one in the list so users can switch back? 
                                       Standard practice is usually to list ALL valid offers, highlighting selected. 
                                       Let's list ALL offers for this variant. */}
                                   {activeVariant.listings.map(offer => (
                                       <tr key={offer.id} className={`transition-colors ${currentDisplayOffer?.id === offer.id ? 'bg-nexus-primary/10 border-l-4 border-nexus-primary' : 'hover:bg-nexus-hover'}`}>
                                           <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                               <img src={offer.seller.avatar} className="w-6 h-6 rounded-full" alt=""/>
                                               {offer.seller.username}
                                           </td>
                                           <td className="px-6 py-4 text-green-400 font-medium">99.5%</td>
                                           <td className="px-6 py-4">{offer.deliveryType === 'Instant' ? <Badge variant="instant">Instant</Badge> : 'Manual'}</td>
                                           <td className="px-6 py-4">{offer.stock}</td>
                                           <td className="px-6 py-4 text-right font-bold text-white">${offer.price.toFixed(2)}</td>
                                           <td className="px-6 py-4 text-right">
                                               {currentDisplayOffer?.id === offer.id ? (
                                                   <span className="text-xs font-bold text-nexus-primary uppercase">Selected</span>
                                               ) : (
                                                   <Button size="sm" variant="secondary" onClick={() => { setSelectedOfferId(offer.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>View</Button>
                                               )}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               )}
           </div>
       ) : (
           /* --- STANDARD GRID LAYOUT FOR ACCOUNTS/ITEMS --- */
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* LEFT SIDEBAR FILTERS (Standard) */}
               <div className="hidden lg:block lg:col-span-1 space-y-4">
                  {isDevMode && (
                      <DevNote title="Dynamic Filtering Logic">
                          Filters below are generated from `game.categoryConfigs.listingFields`. <br/>
                          Example: If Admin adds "Skin Count" as a "Range" field, a Min/Max input appears automatically.
                      </DevNote>
                  )}
                  <div className="flex items-center gap-2 mb-2 text-white font-bold uppercase tracking-wider text-xs">
                     <Filter size={14} /> Filters
                  </div>
                  <Accordion title="Seller Status" defaultOpen>
                     <div className="space-y-2">
                        <Checkbox label="Online Sellers Only" checked={isOnlineOnly} onChange={() => setIsOnlineOnly(!isOnlineOnly)} />
                        <Checkbox label="Instant Delivery" checked={isInstantOnly} onChange={() => setIsInstantOnly(!isInstantOnly)} />
                     </div>
                  </Accordion>
                  <Accordion title="Price Range ($)" defaultOpen>
                     <div className="flex gap-2 items-center">
                        <input type="number" placeholder="Min" className="w-full bg-[#150d22] border border-[#2f264a] rounded px-2 py-2 text-xs text-white" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} />
                        <span className="text-gray-500">-</span>
                        <input type="number" placeholder="Max" className="w-full bg-[#150d22] border border-[#2f264a] rounded px-2 py-2 text-xs text-white" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} />
                     </div>
                  </Accordion>
                  {availablePlatforms.length > 0 && (
                     <Accordion title="Platforms" defaultOpen>
                        <div className="space-y-2">
                           {availablePlatforms.map(p => (
                              <Checkbox key={p.id} label={p.name} checked={selectedPlatforms.includes(p.id)} onChange={() => togglePlatform(p.id)} />
                           ))}
                        </div>
                     </Accordion>
                  )}
                  {filterableFields.map(field => (
                      <Accordion key={field.id} title={field.label} defaultOpen>
                          {field.filterType === 'select' && (
                              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                 {field.options?.map(opt => (
                                    <div key={opt} className={`text-xs cursor-pointer px-3 py-1.5 rounded transition-colors ${customFilters[field.id] === opt ? 'bg-nexus-primary text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-[#1f1630]'}`} onClick={() => setCustomFilters({...customFilters, [field.id]: customFilters[field.id] === opt ? '' : opt})}>
                                        {opt}
                                    </div>
                                 ))}
                              </div>
                          )}
                          {field.filterType === 'range' && (
                              <div className="flex gap-2 items-center">
                                  <input type="number" placeholder="Min" className="w-full bg-[#150d22] border border-[#2f264a] rounded px-2 py-2 text-xs text-white" value={customFilters[field.id]?.min || ''} onChange={(e) => handleRangeChange(field.id, 'min', e.target.value)} />
                                  <span className="text-gray-500">-</span>
                                  <input type="number" placeholder="Max" className="w-full bg-[#150d22] border border-[#2f264a] rounded px-2 py-2 text-xs text-white" value={customFilters[field.id]?.max || ''} onChange={(e) => handleRangeChange(field.id, 'max', e.target.value)} />
                              </div>
                          )}
                      </Accordion>
                  ))}
                  <Button variant="secondary" size="sm" fullWidth onClick={() => { setSelectedPlatforms([]); setIsOnlineOnly(false); setIsInstantOnly(false); setPriceRange({ min: '', max: '' }); setCustomFilters({}); }}>Reset All Filters</Button>
               </div>

               {/* MAIN GRID */}
               <div className="lg:col-span-3">
                   {filteredListings.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                         {filteredListings.map((listing) => (
                               <AccountListingGridCard 
                                 key={listing.id} 
                                 listing={listing} 
                                 platforms={platforms} 
                                 fields={gameCategoryConfig?.listingFields} 
                                 onClick={() => onNavigate('PRODUCT', listing)}
                               />
                         ))}
                      </div>
                   ) : (
                      <div className="p-12 text-center text-gray-500 bg-nexus-card border border-nexus-border rounded-xl border-dashed h-64 flex flex-col items-center justify-center">
                         <Search className="mb-4 opacity-20" size={48} />
                         <p className="text-lg font-medium">No offers found</p>
                         <p className="text-sm mt-2">Try adjusting your filters to see more results.</p>
                      </div>
                   )}
               </div>
           </div>
       )}
    </div>
  );
};
