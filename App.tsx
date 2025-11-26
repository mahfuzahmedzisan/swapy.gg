
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Shield, ChevronDown, User as UserIcon, LogOut, Search, MessageSquare, Moon, Sun, 
  Bell, Globe, LayoutDashboard, ShoppingBag, Wallet, PlusCircle, Check, Code
} from 'lucide-react';
import { ViewState, User, Game, Category, Platform, PlatformGroup, Listing, Order, Banner } from './types';
import { HomeView } from './views/marketplace/HomeView';
import { GameLandingView } from './views/marketplace/GameLandingView';
import { GameSelectionView } from './views/marketplace/GameSelectionView';
import { ListingsView } from './views/marketplace/ListingsView';
import { ProductView } from './views/marketplace/ProductView';
import { SellerProfileView } from './views/marketplace/SellerProfileView';
import { OrderDetailsView } from './views/OrderViews';
import { CheckoutView } from './views/CheckoutView';
import { AdminView } from './views/AdminView';
import { BuyerDashboard } from './views/dashboard/BuyerDashboard';
import { SellerDashboard } from './views/dashboard/SellerDashboard';
import { 
  CURRENT_USER, 
  GAMES as INITIAL_GAMES, 
  CATEGORIES as INITIAL_CATEGORIES, 
  PLATFORMS as INITIAL_PLATFORMS, 
  PLATFORM_GROUPS as INITIAL_PLATFORM_GROUPS,
  MOCK_SELLERS,
  LISTINGS as INITIAL_LISTINGS,
  MOCK_BANNERS as INITIAL_BANNERS
} from './data/mockData';
import { Button, ToastContainer, Toast, Modal } from './components/UIComponents';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [viewData, setViewData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Developer Mode ---
  const [isDevMode, setIsDevMode] = useState(true);

  // --- Preferences State ---
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // --- Notification State ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = [
     { id: 1, text: 'Order #98BC4674 confirmed', time: '2 min ago', read: false },
     { id: 2, text: 'New message from PixelStoreLAT', time: '1 hour ago', read: false },
     { id: 3, text: 'Welcome to SWAPY.GG!', time: '1 day ago', read: true },
  ];

  // --- Centralized "Database" State ---
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [platforms, setPlatforms] = useState<Platform[]>(INITIAL_PLATFORMS);
  const [platformGroups, setPlatformGroups] = useState<PlatformGroup[]>(INITIAL_PLATFORM_GROUPS);
  const [users, setUsers] = useState<User[]>(MOCK_SELLERS);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);

  // --- Theme Effect ---
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Navigation Handler
  const navigate = (view: ViewState, data?: any) => {
    if (data) setViewData(data);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // --- Admin Actions ---
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addToast(`User ${updatedUser.username} updated`);
  };

  const handleSaveGame = (game: Game) => {
    // 1. Update the Game Registry
    if (games.find(g => g.id === game.id)) {
      setGames(prev => prev.map(g => g.id === game.id ? game : g));
      
      // 2. Cascade Update: Sync all listings that use variants from this game
      // This ensures if Admin changes "1000 V-Bucks" image/name, all listings update.
      setListings(prevListings => {
          return prevListings.map(listing => {
              if (listing.gameId === game.id && listing.variantId) {
                  // Look for the variant in the NEW game config
                  const catConfig = game.categoryConfigs?.[listing.categoryId];
                  const variant = catConfig?.predefinedVariants?.find(v => v.id === listing.variantId);
                  
                  if (variant) {
                      return {
                          ...listing,
                          title: variant.name,
                          image: variant.image || game.image, // Fallback to game image if variant has none
                          unit: variant.subtitle || listing.unit // Sync subtitle as well
                      };
                  }
              }
              return listing;
          });
      });

      addToast('Game and linked listings updated successfully');
    } else {
      setGames(prev => [...prev, game]);
      addToast('New game added to catalog');
    }
  };

  const handleDeleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    addToast('Game deleted', 'error');
  };

  const handleSaveCategory = (category: Category) => {
    if (categories.find(c => c.id === category.id)) {
      setCategories(prev => prev.map(c => c.id === category.id ? category : c));
      addToast('Category updated');
    } else {
      setCategories(prev => [...prev, category]);
      addToast('Category created');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    addToast('Category deleted', 'error');
  };

  const handleSavePlatformGroup = (group: PlatformGroup) => {
    if (platformGroups.find(p => p.id === group.id)) {
      setPlatformGroups(prev => prev.map(p => p.id === group.id ? group : p));
    } else {
      setPlatformGroups(prev => [...prev, group]);
    }
    addToast('Platform Group Saved');
  };

  const handleSaveBanner = (banner: Banner) => {
      if (banners.find(b => b.id === banner.id)) {
          setBanners(prev => prev.map(b => b.id === banner.id ? banner : b));
      } else {
          setBanners(prev => [...prev, banner]);
      }
      addToast('Banner saved');
  }

  const handleDeleteBanner = (id: string) => {
      setBanners(prev => prev.filter(b => b.id !== id));
      addToast('Banner deleted');
  }

  // --- Listing Actions (Global) ---
  const handleAddListing = (listing: Listing) => {
    setListings(prev => [listing, ...prev]);
    addToast('Offer published successfully!');
  };

  const handleUpdateListing = (listing: Listing) => {
    setListings(prev => prev.map(l => l.id === listing.id ? listing : l));
    addToast('Offer updated successfully!');
  };

  const handleDeleteListing = (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
    addToast('Offer deleted', 'error');
  };

  const NavLink: React.FC<{ label: string, onClick?: () => void, active?: boolean }> = ({ label, onClick, active }) => (
    <button 
      onClick={onClick}
      className={`text-sm font-bold transition-all px-3 py-2 rounded-lg ${active ? 'text-white bg-nexus-card border-nexus-border border' : 'text-gray-400 hover:text-white hover:bg-nexus-hover'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-nexus-main text-gray-200 font-sans flex flex-col selection:bg-nexus-primary selection:text-white transition-colors duration-300">
      <ToastContainer toasts={toasts} />
      
      {/* Header */}
      <header className="bg-nexus-header sticky top-0 z-50 border-b border-nexus-border shadow-2xl transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20 gap-8">
            
            {/* Logo & Navigation */}
            <div className="flex items-center gap-8">
               <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('HOME')}>
                  <div className="w-10 h-10 bg-nexus-primary rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-nexus-primary/30 group-hover:scale-105 transition-transform">
                     <span className="font-black text-2xl text-white">S</span>
                  </div>
                  <div className="font-black text-2xl tracking-tighter text-white">
                    SWAPY<span className="text-nexus-primary">.GG</span>
                  </div>
               </div>

               {/* Desktop Nav */}
               <div className="hidden xl:flex space-x-1">
                  {/* Removed 'Home' as logo handles it */}
                  {categories.filter(c => c.isActive).map(cat => (
                     <NavLink 
                       key={cat.id} 
                       label={cat.name} 
                       onClick={() => navigate('GAME_SELECTION', { category: cat })} 
                       active={currentView === 'GAME_SELECTION' && viewData?.category?.id === cat.id} 
                     />
                  ))}
               </div>
            </div>

            {/* Central Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 group-focus-within:text-nexus-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search games, items, or sellers..." 
                className="w-full bg-nexus-main border border-nexus-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary transition-all shadow-inner placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                 <button className="bg-nexus-card border border-nexus-border text-xs px-2 py-1 rounded text-gray-400">CTRL+K</button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
               
               {/* Sell Button */}
               {isLoggedIn && (
                  <Button 
                    variant="accent" 
                    size="sm" 
                    icon={PlusCircle} 
                    className="hidden md:flex font-black"
                    onClick={() => navigate('SELLER_DASHBOARD')}
                  >
                    Sell
                  </Button>
               )}

               <div className="hidden md:flex items-center space-x-4 text-gray-400 relative">
                  
                  {/* Developer Mode Toggle */}
                  <div 
                     className={`p-2 rounded-lg cursor-pointer transition-colors ${isDevMode ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-nexus-hover hover:text-white'}`}
                     onClick={() => setIsDevMode(!isDevMode)}
                     title="Toggle Developer Documentation"
                  >
                      <Code size={20} />
                  </div>

                  {/* Theme Toggle */}
                  <div 
                     className="p-2 rounded-lg hover:bg-nexus-hover cursor-pointer text-gray-400 hover:text-white transition-colors"
                     onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                     title="Toggle Theme"
                  >
                      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </div>

                  <div className="w-px h-6 bg-nexus-border"></div>

                  {/* Language & Currency */}
                  <div 
                     className="flex items-center cursor-pointer hover:text-white transition-colors px-2 py-1 rounded hover:bg-nexus-hover"
                     onClick={() => setIsLangModalOpen(true)}
                  >
                     <Globe size={18} className="mr-1.5"/>
                     <span className="text-xs font-bold">{language} / {currency}</span>
                  </div>
                  
                  <div className="w-px h-6 bg-nexus-border"></div>
                  
                  {/* Notifications */}
                  <div className="relative">
                     <Bell 
                        size={20} 
                        className={`hover:text-nexus-primary cursor-pointer transition-colors ${isNotifOpen ? 'text-white' : ''}`} 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                     />
                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                     
                     {/* Notification Dropdown */}
                     {isNotifOpen && (
                        <div className="absolute top-full right-0 mt-4 w-80 bg-nexus-card border border-nexus-border rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                           <div className="px-4 py-3 border-b border-nexus-border flex justify-between items-center bg-nexus-header">
                              <h4 className="font-bold text-white text-sm">Notifications</h4>
                              <span className="text-[10px] text-nexus-primary cursor-pointer hover:underline">Mark all read</span>
                           </div>
                           <div className="max-h-64 overflow-y-auto custom-scrollbar">
                              {notifications.map(n => (
                                 <div key={n.id} className={`px-4 py-3 border-b border-nexus-border last:border-0 hover:bg-nexus-hover cursor-pointer ${!n.read ? 'bg-nexus-primary/5' : ''}`}>
                                    <p className="text-sm text-gray-200 mb-1">{n.text}</p>
                                    <p className="text-[10px] text-gray-500">{n.time}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
               
               {/* Auth / User */}
               {isLoggedIn ? (
                  <div className="flex items-center pl-2 pt-2 pb-2">
                      <div className="flex items-center space-x-3 cursor-pointer p-1 rounded-xl hover:bg-nexus-card border border-transparent hover:border-nexus-border transition-all group relative">
                        <img src={CURRENT_USER.avatar} alt="User" className="w-9 h-9 rounded-full border border-nexus-border bg-nexus-main" />
                        <div className="hidden md:block text-left mr-2">
                            <p className="text-xs font-bold text-white leading-none">{CURRENT_USER.username}</p>
                            <p className="text-[10px] text-nexus-primary font-bold mt-1 leading-none">Level 12</p>
                        </div>
                        <ChevronDown size={14} className="text-gray-500" />
                        
                        {/* Dropdown Menu */}
                        <div className="hidden group-hover:block absolute top-full right-0 mt-0 w-64 bg-nexus-card border border-nexus-border rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
                           <div className="px-4 py-3 border-b border-nexus-border mb-2 bg-nexus-main/30">
                              <p className="text-white font-bold text-sm">{CURRENT_USER.username}</p>
                              <p className="text-xs text-nexus-success mt-1">Wallet: ${CURRENT_USER.walletBalance.toFixed(2)}</p>
                           </div>
                           
                           <div className="px-2 space-y-1">
                              {/* Buyer Options */}
                              <button onClick={() => navigate('BUYER_DASHBOARD')} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-nexus-hover rounded-lg transition-colors flex items-center">
                                 <ShoppingBag size={16} className="mr-3 text-nexus-primary"/> Buyer Dashboard
                              </button>
                              <button onClick={() => navigate('ORDER_DETAIL')} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-nexus-hover rounded-lg transition-colors flex items-center pl-8">
                                 My Orders
                              </button>
                              <div className="border-t border-nexus-border my-1"></div>
                              
                              {/* Seller Options */}
                              <button onClick={() => navigate('SELLER_DASHBOARD')} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-nexus-hover rounded-lg transition-colors flex items-center">
                                 <LayoutDashboard size={16} className="mr-3 text-nexus-gold"/> Seller Store
                              </button>
                              <div className="border-t border-nexus-border my-1"></div>

                              {/* Admin Link (Mock) */}
                              <button onClick={() => navigate('ADMIN')} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-nexus-hover rounded-lg transition-colors flex items-center">
                                 <Shield size={16} className="mr-3 text-red-400"/> Admin Panel
                              </button>
                           </div>

                           <div className="border-t border-nexus-border mt-2 pt-2 px-2">
                              <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center">
                                 <LogOut size={14} className="mr-2"/> Logout
                              </button>
                           </div>
                        </div>
                      </div>
                  </div>
               ) : (
                  <div className="flex gap-3">
                     <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)}>Log In</Button>
                     <Button variant="primary" size="sm" onClick={() => setIsLoggedIn(true)}>Sign Up</Button>
                  </div>
               )}
               
               <Button variant="ghost" className="xl:hidden p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                 {isMobileMenuOpen ? <X /> : <Menu />}
               </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-nexus-header border-b border-nexus-border shadow-2xl z-50">
             <div className="flex flex-col p-4 space-y-2">
                <Button variant="ghost" className="justify-start" onClick={() => { navigate('HOME'); setIsMobileMenuOpen(false); }}>Home</Button>
                {categories.map(cat => (
                   <Button key={cat.id} variant="ghost" className="justify-start" onClick={() => { navigate('GAME_SELECTION', { category: cat }); setIsMobileMenuOpen(false); }}>{cat.name}</Button>
                ))}
                <div className="border-t border-nexus-border my-2"></div>
                
                {/* Mobile Theme Toggle */}
                <div className="flex justify-between items-center px-4 py-2 text-gray-400">
                    <span>Appearance</span>
                    <div className="flex bg-nexus-card rounded-lg p-1 border border-nexus-border">
                        <button onClick={() => setTheme('dark')} className={`p-1 rounded ${theme === 'dark' ? 'bg-nexus-primary text-white' : ''}`}><Moon size={16}/></button>
                        <button onClick={() => setTheme('light')} className={`p-1 rounded ${theme === 'light' ? 'bg-nexus-primary text-white' : ''}`}><Sun size={16}/></button>
                    </div>
                </div>

                <Button variant="ghost" className="justify-start text-nexus-primary" onClick={() => { navigate('ADMIN'); setIsMobileMenuOpen(false); }}>Admin Panel</Button>
             </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
        {currentView === 'HOME' && <HomeView onNavigate={navigate} games={games} banners={banners} isDevMode={isDevMode} />}
        {currentView === 'GAME_SELECTION' && <GameSelectionView category={viewData?.category} games={games} onNavigate={navigate} isDevMode={isDevMode} />}
        {currentView === 'GAME_LANDING' && (
            <GameLandingView 
                game={games.find(g => g.id === viewData.gameId)} 
                categories={categories} 
                onNavigate={navigate} 
                isDevMode={isDevMode}
            />
        )}
        {currentView === 'LISTINGS' && (
            <ListingsView 
                onNavigate={navigate} 
                gameId={viewData?.gameId} 
                category={viewData?.category} 
                games={games} 
                platformGroups={platformGroups} 
                platforms={platforms} 
                listings={listings} 
                isDevMode={isDevMode}
            />
        )}
        {currentView === 'PRODUCT' && <ProductView listing={viewData} listings={listings} platforms={platforms} onNavigate={navigate} isDevMode={isDevMode} />}
        {currentView === 'SELLER_PROFILE' && <SellerProfileView seller={viewData} isDevMode={isDevMode} />}
        {currentView === 'CHECKOUT' && <CheckoutView onComplete={() => navigate('ORDER_DETAIL')} isDevMode={isDevMode} />}
        {currentView === 'ORDER_DETAIL' && <OrderDetailsView onBack={() => navigate('BUYER_DASHBOARD')} isDevMode={isDevMode} />}
        {currentView === 'BUYER_DASHBOARD' && <BuyerDashboard isDevMode={isDevMode} />}
        {currentView === 'SELLER_DASHBOARD' && (
            <SellerDashboard 
                games={games} 
                categories={categories} 
                platforms={platforms}
                listings={listings} // Pass global listings
                onAddListing={handleAddListing}
                onUpdateListing={handleUpdateListing}
                onDeleteListing={handleDeleteListing}
                isDevMode={isDevMode}
            />
        )}
        
        {/* Admin View with Dynamic Props */}
        {currentView === 'ADMIN' && (
           <AdminView 
             users={users}
             games={games}
             categories={categories}
             platforms={platforms}
             platformGroups={platformGroups}
             banners={banners}
             onUpdateUser={handleUpdateUser}
             onSaveGame={handleSaveGame}
             onDeleteGame={handleDeleteGame}
             onSaveCategory={handleSaveCategory}
             onDeleteCategory={handleDeleteCategory}
             onSavePlatformGroup={handleSavePlatformGroup}
             onSaveBanner={handleSaveBanner}
             onDeleteBanner={handleDeleteBanner}
             isDevMode={isDevMode}
           />
        )}
      </main>

      {/* Regional Settings Modal */}
      <Modal isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} title="Regional Settings" size="md">
         <div className="space-y-6">
            <div>
               <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Select Language</label>
               <div className="grid grid-cols-2 gap-3">
                  {[
                     { code: 'EN', label: 'English', icon: '🇺🇸' },
                     { code: 'ES', label: 'Español', icon: '🇪🇸' },
                     { code: 'DE', label: 'Deutsch', icon: '🇩🇪' },
                     { code: 'FR', label: 'Français', icon: '🇫🇷' }
                  ].map(lang => (
                     <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-4 py-3 rounded-xl border flex items-center text-sm font-bold transition-all ${
                           language === lang.code 
                           ? 'bg-nexus-primary text-white border-nexus-primary shadow-lg shadow-nexus-primary/20' 
                           : 'bg-nexus-main border-nexus-border text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                     >
                        <span className="mr-3 text-lg">{lang.icon}</span> {lang.label}
                        {language === lang.code && <Check size={16} className="ml-auto"/>}
                     </button>
                  ))}
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Select Currency</label>
               <div className="grid grid-cols-2 gap-3">
                  {['USD', 'EUR', 'GBP', 'CAD'].map(curr => (
                     <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-between ${
                           currency === curr 
                           ? 'bg-nexus-primary text-white border-nexus-primary shadow-lg shadow-nexus-primary/20' 
                           : 'bg-nexus-main border-nexus-border text-gray-400 hover:border-gray-500 hover:text-white'
                        }`}
                     >
                        {curr}
                        {currency === curr && <Check size={16} />}
                     </button>
                  ))}
               </div>
            </div>
            <Button fullWidth size="lg" onClick={() => setIsLangModalOpen(false)}>Save Preferences</Button>
         </div>
      </Modal>

      {/* Footer */}
      <footer className="bg-nexus-header border-t border-nexus-border py-16 mt-auto transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
           <div className="col-span-2">
              <div className="font-black text-2xl text-white mb-6 flex items-center">
                 <div className="w-8 h-8 bg-nexus-primary rounded mr-2"></div> SWAPY
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                 The world's leading marketplace for gamers. Buy and sell currency, items, and accounts with 100% security guaranteed by our escrow system.
              </p>
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-nexus-card border border-nexus-border flex items-center justify-center hover:border-nexus-primary cursor-pointer transition-colors"><Globe size={14} className="text-gray-400"/></div>)}
              </div>
           </div>
           
           <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Marketplace</h4>
              <ul className="space-y-4 text-gray-500">
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Start Selling</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Browse Games</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Token Shop</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Gift Cards</li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
              <ul className="space-y-4 text-gray-500">
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Help Center</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Report Scams</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">API Docs</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Contact Us</li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
              <ul className="space-y-4 text-gray-500">
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Privacy Policy</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Terms of Service</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">Cookie Policy</li>
                 <li className="hover:text-nexus-primary cursor-pointer transition-colors">AML Policy</li>
              </ul>
           </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 mt-16 pt-8 border-t border-nexus-border text-center text-xs text-gray-600 flex justify-between items-center">
           <span>&copy; 2025 SWAPY.GG Inc. All rights reserved.</span>
           <div className="flex gap-4">
              <span className="opacity-50">VISA</span>
              <span className="opacity-50">MasterCard</span>
              <span className="opacity-50">PayPal</span>
              <span className="opacity-50">Crypto</span>
           </div>
        </div>
      </footer>
    </div>
  );
}
