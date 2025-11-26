
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, DollarSign, Settings, Plus, Edit, Trash2, 
  ShoppingCart, AlertCircle, Search, 
  Clock, Upload, MessageSquare, ShieldCheck, Globe, Zap, BarChart3, ChevronDown, Filter, ChevronRight, X, ArrowLeft, Save,
  Gift, CreditCard, Power, Bell
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, TextArea, Accordion, RadioCard, DevNote, Checkbox } from '../../components/UIComponents';
import { Listing, Game, Category, Platform, GameVariant } from '../../types';
import { AccountListingGridCard } from '../../components/listings/AccountListingGridCard';
import { CURRENT_USER } from '../../data/mockData';

const MOCK_INCOMING_ORDERS: any[] = [
    { id: 'ord_1', item: '1000 V-Bucks Key', buyer: 'Gamer123', price: 8.99, status: 'Pending', date: '2 min ago' },
    { id: 'ord_2', item: 'Fortnite Account - Travis Scott', buyer: 'ProPlayerX', price: 450.00, status: 'Verifying', date: '1 hour ago' },
    { id: 'ord_3', item: 'OSRS Gold 10M', buyer: 'Scaper99', price: 2.90, status: 'Completed', date: '1 day ago' },
    { id: 'ord_4', item: '5000 V-Bucks', buyer: 'FortFan', price: 35.99, status: 'Completed', date: '2 days ago' },
    { id: 'ord_5', item: 'Apex Legends Boost', buyer: 'WraithMain', price: 50.00, status: 'Disputed', date: '3 days ago' },
];

interface SellerDashboardProps {
  games: Game[];
  categories: Category[];
  platforms: Platform[];
  listings: Listing[];
  onAddListing: (listing: Listing) => void;
  onUpdateListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  isDevMode?: boolean;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  games, categories, platforms, listings, 
  onAddListing, onUpdateListing, onDeleteListing, isDevMode
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LISTINGS' | 'ORDERS' | 'WALLET' | 'MESSAGES' | 'SETTINGS' | 'EDITOR'>('OVERVIEW');
  
  // Dashboard Filtering State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'SOLD' | 'PURCHASED'>('ALL'); // For Orders Tab

  // Editor State
  const [editorMode, setEditorMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editorStep, setEditorStep] = useState<1 | 2 | 3>(1); // 1: Category, 2: Game, 3: Details
  const [editingListing, setEditingListing] = useState<Partial<Listing>>({
      title: '', price: 0, stock: 1, description: '', deliveryType: 'Instant', customValues: {}, tags: []
  });

  const myListings = listings.filter(l => l.sellerId === CURRENT_USER.id || l.seller.id === CURRENT_USER.id);

  // --- EDITOR COMPUTED VALUES ---
  const selectedGameForListing = games.find(g => g.id === editingListing.gameId);
  const selectedCategoryForListing = categories.find(c => c.id === editingListing.categoryId);
  
  // Important: Get the specific config for this Game+Category combination
  const selectedGameCategoryConfig = (selectedGameForListing && editingListing.categoryId) 
    ? selectedGameForListing.categoryConfigs?.[editingListing.categoryId] 
    : null;
  
  // Check if this category enforces predefined products
  // FIX: Only enforce if it's a Gift Card Layout AND has variants
  const isGiftCardLayout = selectedCategoryForListing?.layout === 'GROUPED_GIFT_CARD';
  const predefinedVariants = selectedGameCategoryConfig?.predefinedVariants || [];
  const hasPredefinedProducts = predefinedVariants.length > 0;
  
  const showProductDropdown = isGiftCardLayout && hasPredefinedProducts;

  // Games available for the selected category
  const gamesForSelectedCategory = games.filter(g => editingListing.categoryId ? g.categoryIds.includes(editingListing.categoryId) : false);

  // --- ACTIONS ---

  const openCreateEditor = () => {
     setEditorMode('CREATE');
     setEditorStep(1); // Start with Category Selection
     setEditingListing({
        title: '', price: 0, stock: 1, description: '', deliveryType: 'Instant', customValues: {}, tags: [],
        sellerId: CURRENT_USER.id, seller: CURRENT_USER
     });
     setActiveTab('EDITOR');
  };

  const openEditEditor = (listing: Listing) => {
     setEditorMode('EDIT');
     setEditorStep(3); // Skip selection
     setEditingListing({ ...listing });
     setActiveTab('EDITOR');
  };

  const handleVariantSelect = (variantId: string) => {
      const variant = predefinedVariants.find(v => v.id === variantId);
      if (variant) {
          setEditingListing(prev => ({
              ...prev,
              title: variant.name,
              variantId: variant.id,
              image: variant.image || selectedGameForListing?.image, // Use specific image if available
              unit: variant.subtitle || 'Unit' // Map subtitle to unit
          }));
      }
  };

  const handleSaveListing = () => {
     if (!editingListing.title || !editingListing.price) {
        alert("Please fill in required fields (Title, Price)");
        return;
     }

     const finalListing = {
        ...editingListing,
        id: editingListing.id || `l_${Date.now()}`,
        status: editingListing.status || 'Active',
        image: editingListing.image || selectedGameForListing?.image,
        sellerId: CURRENT_USER.id,
        seller: CURRENT_USER,
        tags: editingListing.tags || ['Verified'],
        unit: editingListing.unit || 'Unit',
        minQty: 1,
        deliveryTime: editingListing.deliveryType === 'Instant' ? 'Instant' : '1 Hour'
     } as Listing;

     if (editorMode === 'CREATE') {
        onAddListing(finalListing);
     } else {
        onUpdateListing(finalListing);
     }

     setActiveTab('LISTINGS');
  };

  const handleDeleteClick = (id: string) => {
     if (window.confirm("Are you sure you want to delete this offer?")) {
        onDeleteListing(id);
     }
  };

  const SidebarButton = ({ id, label, icon: Icon, badge }: any) => (
      <button 
        onClick={() => setActiveTab(id)} 
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-bold text-sm ${
            activeTab === id 
            ? 'bg-nexus-primary text-white shadow-lg shadow-nexus-primary/20' 
            : 'text-gray-400 hover:text-white hover:bg-nexus-hover'
        }`}
      >
        <div className="flex items-center">
            <Icon size={18} className="mr-3" /> {label}
        </div>
        {badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
      </button>
  );

  // --- RENDER EDITOR VIEW ---
  if (activeTab === 'EDITOR') {
     return (
        <div className="max-w-7xl mx-auto min-h-screen pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-4">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('LISTINGS')} className="p-2 bg-nexus-card border border-nexus-border rounded-lg hover:border-nexus-primary hover:text-white text-gray-400 transition-colors">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                     <h1 className="text-3xl font-black text-white">{editorMode === 'CREATE' ? 'Create New Offer' : 'Edit Offer'}</h1>
                     <p className="text-gray-400 text-sm">Step {editorStep} of 3</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setActiveTab('LISTINGS')}>Discard</Button>
                  {editorStep === 3 && <Button icon={Save} onClick={handleSaveListing}>{editorMode === 'CREATE' ? 'Publish Offer' : 'Save Changes'}</Button>}
               </div>
            </div>

            {/* STEP 1: SELECT CATEGORY */}
            {editorStep === 1 && (
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <Card title="1. Select Category">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {categories.map(cat => (
                                <div 
                                    key={cat.id}
                                    onClick={() => {
                                        setEditingListing({...editingListing, categoryId: cat.id});
                                        setEditorStep(2);
                                    }}
                                    className={`p-6 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg ${
                                        editingListing.categoryId === cat.id
                                        ? 'bg-nexus-primary/20 border-nexus-primary text-white' 
                                        : 'bg-[#150d22] border-nexus-border text-gray-400 hover:border-gray-500 hover:text-white'
                                    }`}
                                >
                                    <span className="font-bold text-lg">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* STEP 2: SELECT GAME */}
            {editorStep === 2 && (
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <Card title={`2. Select Game for ${selectedCategoryForListing?.name}`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                            {gamesForSelectedCategory.length > 0 ? gamesForSelectedCategory.map(g => (
                                <RadioCard 
                                    key={g.id}
                                    title={g.name}
                                    image={g.image}
                                    selected={editingListing.gameId === g.id}
                                    onClick={() => {
                                        setEditingListing({...editingListing, gameId: g.id});
                                        setEditorStep(3);
                                    }}
                                />
                            )) : (
                                <div className="col-span-4 text-center py-10 text-gray-500">
                                    No games found for this category.
                                    <br/>
                                    <Button variant="ghost" size="sm" onClick={() => setEditorStep(1)} className="mt-4">Go Back</Button>
                                </div>
                            )}
                        </div>
                    </Card>
                    <div className="flex justify-start">
                         <Button variant="secondary" onClick={() => setEditorStep(1)}>Back to Categories</Button>
                    </div>
                </div>
            )}

            {/* STEP 3: DETAILS */}
            {editorStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                   {/* FORM */}
                   <div className="lg:col-span-8 space-y-8">
                      {isDevMode && (
                          <DevNote title="Optimistic Locking & Validation">
                              <strong>1. Validation:</strong> Use strict schema validation (Zod/Yup) on the backend. Do not trust `customValues` types blindly. <br/>
                              <strong>2. Concurrency:</strong> If editing an existing listing, check the `version` or `updated_at` column. If the item was bought/modified by a background process since the form loaded, reject the save.
                          </DevNote>
                      )}
                      <Card title="Item Details">
                         <div className="space-y-6">
                            <div className="flex gap-4 p-4 bg-nexus-main border border-nexus-border rounded-lg mb-4">
                                <img src={selectedGameForListing?.image} className="w-12 h-12 rounded" alt=""/>
                                <div>
                                    <div className="font-bold text-white">{selectedGameForListing?.name}</div>
                                    <Badge variant="outline">{selectedCategoryForListing?.name}</Badge>
                                </div>
                                {editorMode === 'CREATE' && (
                                    <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setEditorStep(1)}>Change</Button>
                                )}
                            </div>

                            {/* DYNAMIC TITLE SECTION: Dropdown vs Input */}
                            {showProductDropdown ? (
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Select Product</label>
                                    <Select 
                                        value={editingListing.variantId || ''} 
                                        onChange={(e) => handleVariantSelect(e.target.value)}
                                        className="font-bold text-white"
                                    >
                                        <option value="">-- Choose Product --</option>
                                        {predefinedVariants.map(v => (
                                            <option key={v.id} value={v.id}>{v.name} {v.subtitle ? `(${v.subtitle})` : ''}</option>
                                        ))}
                                    </Select>
                                    <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1"><Gift size={12}/> Product names for this category are predefined by Admin.</p>
                                </div>
                            ) : (
                                <Input 
                                    label="Listing Title" 
                                    placeholder="e.g. Fortnite Account - Black Knight + 50 Skins" 
                                    value={editingListing.title}
                                    onChange={(e) => setEditingListing({...editingListing, title: e.target.value})}
                                />
                            )}

                            {/* Dynamic Fields - RENDERED BASED ON ADMIN CONFIG */}
                            <div className="bg-[#150d22] p-6 rounded-xl border border-nexus-border space-y-4">
                               <div className="flex items-center gap-2 mb-2">
                                  <Settings size={16} className="text-nexus-primary" />
                                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Specific Attributes</h4>
                               </div>
                               
                               {selectedGameCategoryConfig && selectedGameCategoryConfig.listingFields.length > 0 ? (
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {selectedGameCategoryConfig.listingFields.map(field => (
                                          <div key={field.id}>
                                             {field.type === 'select' ? (
                                                <Select 
                                                   label={field.label}
                                                   value={editingListing.customValues?.[field.id] || ''}
                                                   onChange={(e) => setEditingListing(prev => ({
                                                      ...prev, 
                                                      customValues: { ...prev.customValues, [field.id]: e.target.value }
                                                   }))}
                                                >
                                                   <option value="">Select...</option>
                                                   {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </Select>
                                             ) : (
                                                <Input 
                                                   label={field.label}
                                                   type={field.type === 'number' ? 'number' : 'text'}
                                                   value={editingListing.customValues?.[field.id] || ''}
                                                   onChange={(e) => setEditingListing(prev => ({
                                                      ...prev, 
                                                      customValues: { ...prev.customValues, [field.id]: e.target.value }
                                                   }))}
                                                />
                                             )}
                                          </div>
                                      ))}
                                   </div>
                               ) : (
                                   <div className="text-sm text-gray-500 italic p-2 border border-dashed border-gray-700 rounded">
                                       No specific filters configured for this game/category by Admin. 
                                       You can proceed with standard fields.
                                   </div>
                               )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               <Input 
                                   label="Price ($)" 
                                   type="number" 
                                   value={editingListing.price}
                                   onChange={(e) => setEditingListing({...editingListing, price: parseFloat(e.target.value)})}
                               />
                               <Input 
                                   label="Stock Quantity" 
                                   type="number" 
                                   value={editingListing.stock}
                                   onChange={(e) => setEditingListing({...editingListing, stock: parseInt(e.target.value)})}
                               />
                               <Select 
                                  label="Platform"
                                  value={editingListing.platformId || ''}
                                  onChange={(e) => setEditingListing({...editingListing, platformId: e.target.value})}
                               >
                                  <option value="">Global / Any</option>
                                  {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                               </Select>
                            </div>

                            <TextArea 
                               label="Detailed Description" 
                               placeholder="Describe your item... include important details like login method, warranty, etc." 
                               rows={6} 
                               value={editingListing.description}
                               onChange={(e) => setEditingListing({...editingListing, description: e.target.value})}
                            />
                         </div>
                      </Card>

                      <Card title="Delivery Method">
                         <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {(!selectedGameCategoryConfig || selectedGameCategoryConfig.deliveryOptions.includes('Instant')) && (
                                   <div 
                                     onClick={() => setEditingListing({...editingListing, deliveryType: 'Instant'})}
                                     className={`p-6 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all ${editingListing.deliveryType === 'Instant' ? 'bg-nexus-primary/10 border-nexus-primary' : 'bg-[#150d22] border-nexus-border hover:border-gray-500'}`}
                                   >
                                      <Zap size={24} className={editingListing.deliveryType === 'Instant' ? 'text-white' : 'text-gray-500'} />
                                      <div className="text-center font-bold text-white">Instant Delivery</div>
                                   </div>
                               )}
                               {(!selectedGameCategoryConfig || selectedGameCategoryConfig.deliveryOptions.includes('Manual')) && (
                                   <div 
                                     onClick={() => setEditingListing({...editingListing, deliveryType: 'Manual'})}
                                     className={`p-6 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-3 transition-all ${editingListing.deliveryType === 'Manual' ? 'bg-nexus-primary/10 border-nexus-primary' : 'bg-[#150d22] border-nexus-border hover:border-gray-500'}`}
                                   >
                                      <Clock size={24} className={editingListing.deliveryType === 'Manual' ? 'text-white' : 'text-gray-500'} />
                                      <div className="text-center font-bold text-white">Manual Delivery</div>
                                   </div>
                               )}
                            </div>
                         </div>
                      </Card>
                   </div>

                   {/* PREVIEW */}
                   <div className="lg:col-span-4 space-y-6">
                      <div className="sticky top-24">
                         <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Live Preview</h4>
                         <div className="pointer-events-none transform scale-100 origin-top">
                            <AccountListingGridCard 
                               listing={{
                                  ...editingListing,
                                  id: 'preview',
                                  image: editingListing.image || selectedGameForListing?.image || 'https://picsum.photos/300/300',
                                  seller: CURRENT_USER,
                                  tags: editingListing.tags || ['Preview'],
                                  price: editingListing.price || 0,
                                  title: editingListing.title || 'Your Listing Title',
                                  unit: editingListing.unit || 'Unit'
                               } as Listing}
                               platforms={platforms}
                               onClick={() => {}}
                            />
                         </div>
                      </div>
                   </div>
                </div>
            )}
        </div>
     );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="max-w-7xl mx-auto min-h-[80vh]">
       <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Seller Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {CURRENT_USER.username}</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" size="sm" icon={Globe}>View Public Store</Button>
          </div>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* SIDEBAR */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 bg-nexus-card border border-nexus-border rounded-xl p-4 shadow-xl space-y-2">
                 <SidebarButton id="OVERVIEW" label="Overview" icon={LayoutDashboard} />
                 
                 <Accordion title={<div className="flex items-center"><Package size={18} className="mr-3"/> My Offers</div>}>
                    <div className="space-y-1 pl-6 border-l border-nexus-border ml-2">
                        <button onClick={() => { setActiveTab('LISTINGS'); setSelectedCategoryFilter('All'); }} className="block text-xs text-gray-400 hover:text-white py-1">All Offers</button>
                        {categories.map(c => (
                            <button key={c.id} onClick={() => { setActiveTab('LISTINGS'); setSelectedCategoryFilter(c.id); }} className="block text-xs text-gray-400 hover:text-white py-1">{c.name}</button>
                        ))}
                    </div>
                 </Accordion>

                 <Accordion title={<div className="flex items-center"><ShoppingCart size={18} className="mr-3"/> Orders</div>}>
                    <div className="space-y-1 pl-6 border-l border-nexus-border ml-2">
                        <button onClick={() => { setActiveTab('ORDERS'); setOrderFilter('SOLD'); }} className="block text-xs text-gray-400 hover:text-white py-1">Sold Orders</button>
                        <button onClick={() => { setActiveTab('ORDERS'); setOrderFilter('PURCHASED'); }} className="block text-xs text-gray-400 hover:text-white py-1">Purchased Orders</button>
                    </div>
                 </Accordion>
                 
                 <SidebarButton id="MESSAGES" label="Messages" icon={MessageSquare} badge="5" />
                 <SidebarButton id="WALLET" label="Wallet" icon={DollarSign} />
                 <SidebarButton id="SETTINGS" label="Settings" icon={Settings} />
             </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* --- OVERVIEW --- */}
             {activeTab === 'OVERVIEW' && (
                <div className="space-y-6">
                   {/* Stats Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-nexus-primary/20 to-nexus-card border-nexus-primary/30">
                         <div className="text-gray-400 text-xs font-bold uppercase mb-2 flex items-center"><BarChart3 size={14} className="mr-1"/> Revenue</div>
                         <div className="text-2xl font-black text-white">$5,420.50</div>
                         <div className="text-xs text-green-400 mt-1 font-medium">+12.5% this month</div>
                      </Card>
                      <Card>
                         <div className="text-gray-400 text-xs font-bold uppercase mb-2">Pending Orders</div>
                         <div className="text-2xl font-black text-white">{MOCK_INCOMING_ORDERS.filter(o => o.status === 'Pending').length}</div>
                      </Card>
                      <Card>
                         <div className="text-gray-400 text-xs font-bold uppercase mb-2">Active Listings</div>
                         <div className="text-2xl font-black text-white">{myListings.filter(l => l.status === 'Active').length}</div>
                      </Card>
                      <Card>
                         <div className="text-gray-400 text-xs font-bold uppercase mb-2">Reputation</div>
                         <div className="text-2xl font-black text-white">99.3%</div>
                      </Card>
                   </div>
                </div>
             )}

             {/* --- LISTINGS (INVENTORY) --- */}
             {activeTab === 'LISTINGS' && (
                <Card 
                  title={selectedCategoryFilter === 'All' ? 'All Offers' : `${categories.find(c => c.id === selectedCategoryFilter)?.name} Offers`}
                  action={<Button icon={Plus} onClick={openCreateEditor}>Create Offer</Button>}
                >
                   {/* Table */}
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-400">
                         <thead className="bg-nexus-main text-xs uppercase font-bold text-gray-500">
                            <tr>
                               <th className="px-4 py-3 rounded-tl-lg">Item Details</th>
                               <th className="px-4 py-3">Category</th>
                               <th className="px-4 py-3">Price</th>
                               <th className="px-4 py-3">Status</th>
                               <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-nexus-border">
                            {myListings
                                .filter(item => selectedCategoryFilter === 'All' || item.categoryId === selectedCategoryFilter)
                                .map(item => {
                                   const category = categories.find(c => c.id === item.categoryId);
                                   const game = games.find(g => g.id === item.gameId);
                                   return (
                                       <tr key={item.id} className="hover:bg-nexus-hover transition-colors">
                                          <td className="px-4 py-3">
                                             <div className="font-bold text-white">{item.title}</div>
                                             <div className="text-[10px] text-gray-500">{game?.name}</div>
                                          </td>
                                          <td className="px-4 py-3">
                                              <Badge variant="outline" className="text-[10px]">{category?.name}</Badge>
                                          </td>
                                          <td className="px-4 py-3 text-white font-medium">${item.price?.toFixed(2)}</td>
                                          <td className="px-4 py-3">
                                             <Badge variant={item.stock > 0 ? 'success' : 'danger'}>{item.stock > 0 ? 'Active' : 'Sold Out'}</Badge>
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                             <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditEditor(item)} className="p-1.5 hover:bg-nexus-primary rounded text-gray-400 hover:text-white transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteClick(item.id)} className="p-1.5 hover:bg-red-500 rounded text-gray-400 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                             </div>
                                          </td>
                                       </tr>
                                   );
                                })
                            }
                            {myListings.filter(item => selectedCategoryFilter === 'All' || item.categoryId === selectedCategoryFilter).length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No listings found.</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </Card>
             )}

             {/* --- ORDERS --- */}
             {activeTab === 'ORDERS' && (
                <div className="space-y-6">
                    {isDevMode && (
                        <DevNote title="Order Processing State Machine">
                            Orders must transition strictly: <br/>
                            1. PENDING (Buyer pays) <br/>
                            2. VERIFYING (Anti-fraud check)<br/>
                            3. DELIVERING (Seller notified)<br/>
                            4. COMPLETED (Buyer confirms / Auto-confirm timer).
                        </DevNote>
                    )}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">{orderFilter === 'SOLD' ? 'Sold Orders' : 'Purchased Orders'}</h2>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setOrderFilter('SOLD')} className={orderFilter === 'SOLD' ? 'bg-nexus-primary text-white' : ''}>Sold</Button>
                            <Button size="sm" variant="secondary" onClick={() => setOrderFilter('PURCHASED')} className={orderFilter === 'PURCHASED' ? 'bg-nexus-primary text-white' : ''}>Purchased</Button>
                        </div>
                    </div>

                    <div className="bg-nexus-card border border-nexus-border rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-nexus-main text-xs uppercase font-bold text-gray-500">
                                <tr>
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-nexus-border">
                                {MOCK_INCOMING_ORDERS.map(order => (
                                    <tr key={order.id} className="hover:bg-nexus-hover transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{order.item}</div>
                                            <div className="text-xs text-gray-500">ID: {order.id} • {order.date}</div>
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-nexus-primary/20 flex items-center justify-center text-xs font-bold text-nexus-primary">{order.buyer[0]}</div>
                                            {order.buyer}
                                        </td>
                                        <td className="px-6 py-4 text-white font-bold">${order.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={order.status === 'Completed' ? 'success' : (order.status === 'Disputed' ? 'danger' : 'warning')}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button size="sm" variant="secondary">Manage</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             )}

             {/* --- WALLET --- */}
             {activeTab === 'WALLET' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-nexus-primary to-[#4c1d95] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden col-span-2">
                            <div className="absolute right-0 top-0 p-6 opacity-10"><DollarSign size={100} /></div>
                            <p className="text-purple-200 font-medium mb-1">Available Balance</p>
                            <h2 className="text-5xl font-black mb-6">$5,420.50</h2>
                            <div className="flex gap-3">
                                <Button variant="secondary" size="sm" icon={CreditCard} className="bg-white/20 border-transparent hover:bg-white/30 text-white">Request Payout</Button>
                                <Button variant="secondary" size="sm" className="bg-white/10 border-transparent hover:bg-white/20 text-white">View History</Button>
                            </div>
                        </div>
                        <Card className="flex flex-col justify-center">
                            <div className="text-center">
                                <div className="text-gray-400 text-xs font-bold uppercase mb-2">Pending Clearance</div>
                                <div className="text-3xl font-black text-white mb-1">$450.00</div>
                                <div className="text-xs text-yellow-500">Available in ~24h</div>
                            </div>
                        </Card>
                    </div>

                    <Card title="Recent Transactions">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border-b border-nexus-border last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><Plus size={18}/></div>
                                    <div>
                                        <div className="font-bold text-white">Sale #ORD-9921</div>
                                        <div className="text-xs text-gray-500">Fortnite Account - Galaxy Skin</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-green-400">+$45.00</div>
                                    <div className="text-xs text-gray-500">Today</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 border-b border-nexus-border last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><ArrowLeft size={18}/></div>
                                    <div>
                                        <div className="font-bold text-white">Payout to PayPal</div>
                                        <div className="text-xs text-gray-500">Withdrawal ID #W-221</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">-$500.00</div>
                                    <div className="text-xs text-gray-500">Yesterday</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
             )}

             {/* --- MESSAGES --- */}
             {activeTab === 'MESSAGES' && (
                <div className="h-[600px] bg-nexus-card border border-nexus-border rounded-xl flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/3 border-r border-nexus-border bg-nexus-main flex flex-col">
                        <div className="p-4 border-b border-nexus-border">
                            <Input placeholder="Search messages..." icon={Search} className="text-xs"/>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 hover:bg-nexus-hover cursor-pointer border-b border-nexus-border transition-colors flex gap-3">
                                    <div className="relative">
                                        <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="w-10 h-10 rounded-full" alt=""/>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-nexus-main rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-white text-sm">Gamer_{i}</span>
                                            <span className="text-[10px] text-gray-500">2m</span>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">Hey, is this item still available for instant delivery?</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-nexus-card">
                        <div className="p-4 border-b border-nexus-border flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <img src="https://ui-avatars.com/api/?name=Gamer_1&background=random" className="w-10 h-10 rounded-full" alt=""/>
                                <div>
                                    <div className="font-bold text-white">Gamer_1</div>
                                    <div className="text-xs text-green-400">Online</div>
                                </div>
                            </div>
                            <Button size="sm" variant="secondary">View Order</Button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            <div className="flex justify-start">
                                <div className="bg-nexus-main border border-nexus-border p-3 rounded-lg rounded-tl-none text-sm text-gray-300 max-w-[80%]">
                                    Hi, I just bought the V-Bucks key. Can you send it?
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-nexus-primary text-white p-3 rounded-lg rounded-tr-none text-sm max-w-[80%]">
                                    Hello! Yes, checking it now. Please give me 2 minutes.
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-nexus-border">
                            <div className="flex gap-2">
                                <Input placeholder="Type a message..." className="flex-1"/>
                                <Button icon={ArrowLeft} className="rotate-180">Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
             )}

             {/* --- SETTINGS --- */}
             {activeTab === 'SETTINGS' && (
                <div className="space-y-6">
                    <Card title="Store Configuration">
                        <div className="space-y-4">
                            <Input label="Display Name" defaultValue={CURRENT_USER.username} />
                            <TextArea label="Store Announcement / Bio" placeholder="Tell buyers about your delivery hours..." rows={3} />
                            <div className="flex items-center justify-between p-3 bg-nexus-main rounded border border-nexus-border">
                                <div>
                                    <div className="font-bold text-white">Vacation Mode</div>
                                    <div className="text-xs text-gray-500">Pause all active listings.</div>
                                </div>
                                <Checkbox label="" checked={false} onChange={() => {}} />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-nexus-main rounded border border-nexus-border">
                                <div>
                                    <div className="font-bold text-white">Auto-Delivery</div>
                                    <div className="text-xs text-gray-500">Automatically send codes if defined in listing.</div>
                                </div>
                                <Checkbox label="" checked={true} onChange={() => {}} />
                            </div>
                            <div className="flex justify-end">
                                <Button icon={Save}>Save Changes</Button>
                            </div>
                        </div>
                    </Card>

                    <Card title="Notification Preferences">
                        <div className="space-y-2">
                            <Checkbox label="Email me when I get a new order" checked={true} onChange={() => {}} />
                            <Checkbox label="Email me when I get a new message" checked={true} onChange={() => {}} />
                            <Checkbox label="Push notifications for disputes" checked={true} onChange={() => {}} />
                        </div>
                    </Card>
                </div>
             )}

          </div>
       </div>
    </div>
  );
};
