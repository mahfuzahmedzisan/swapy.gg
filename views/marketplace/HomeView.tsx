

import React, { useState, useEffect } from 'react';
import { Shield, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Game, Banner } from '../../types';
import { Button, DevNote } from '../../components/UIComponents';

interface HomeViewProps {
  onNavigate: (view: any, data?: any) => void;
  games: Game[];
  banners?: Banner[];
  isDevMode?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, games, banners = [], isDevMode }) => {
  const activeBanners = banners.filter(b => b.active).sort((a,b) => a.position - b.position);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  // Auto-rotate banner
  useEffect(() => {
    if(activeBanners.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentBannerIdx(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  return (
    <div className="space-y-12 pb-10">
      {isDevMode && (
          <DevNote title="Frontend Logic: Hero & Data Fetching">
              1. <strong>Banners:</strong> Fetched from `banners` table (Admin managed). Rotates every 5s. <br/>
              2. <strong>Trending Games:</strong> Currently sorted by mock `popularity`. Backend should run a query calculating orders in last 24h.
          </DevNote>
      )}

      {/* Marketing Banners / Hero Section */}
      {activeBanners.length > 0 ? (
          <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center border border-nexus-border shadow-2xl group">
             <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518] via-[#1a0b2e]/80 to-transparent z-10"></div>
             {activeBanners.map((banner, idx) => (
                 <div 
                    key={banner.id} 
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${idx === currentBannerIdx ? 'opacity-100' : 'opacity-0'}`}
                    style={{backgroundImage: `url(${banner.imageUrl})`}}
                 ></div>
             ))}
             
             <div className="relative z-20 px-8 md:px-16 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexus-primary/20 border border-nexus-primary/30 text-nexus-primary text-xs font-bold uppercase mb-6">
                  <Shield size={12} /> 100% Secure Escrow
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] text-shadow transition-all duration-500">
                   {activeBanners[currentBannerIdx]?.title}
                </h1>
                <p className="text-gray-300 mb-8 text-lg font-medium leading-relaxed max-w-xl">
                   The world's most secure marketplace for In-Game Currency, Items, Accounts, and Boosting. Instant delivery guaranteed.
                </p>
                <div className="flex flex-wrap gap-4">
                   <Button size="lg" className="rounded-full px-10 text-lg" onClick={() => onNavigate('GAME_SELECTION', { category: { id: 'c1', name: 'Currency' } })}>Browse Offers</Button>
                </div>
             </div>

             {/* Carousel Controls */}
             {activeBanners.length > 1 && (
                 <>
                    <button onClick={() => setCurrentBannerIdx((currentBannerIdx - 1 + activeBanners.length) % activeBanners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => setCurrentBannerIdx((currentBannerIdx + 1) % activeBanners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {activeBanners.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentBannerIdx ? 'bg-nexus-primary w-4' : 'bg-white/50'}`}
                                onClick={() => setCurrentBannerIdx(idx)}
                            ></div>
                        ))}
                    </div>
                 </>
             )}
          </div>
      ) : (
          /* Fallback Static Hero if no banners */
           <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center border border-nexus-border shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518] via-[#1a0b2e] to-nexus-primary/20 z-10"></div>
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
             <div className="relative z-20 px-8 md:px-16 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] text-shadow">
                   Level Up Your <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-accent">Gaming Experience</span>
                </h1>
                <Button size="lg" className="rounded-full px-10 text-lg" onClick={() => onNavigate('GAME_SELECTION', { category: { id: 'c1', name: 'Currency' } })}>Browse Offers</Button>
             </div>
          </div>
      )}

      {/* Popular Games Grid */}
      <div>
        <div className="flex justify-between items-end mb-6">
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Flame className="text-orange-500" /> Trending Games
           </h2>
           <button className="text-sm text-nexus-primary font-bold hover:text-white transition-colors">View All Games</button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games.slice(0, 12).map((game) => (
            <div 
              key={game.id} 
              onClick={() => onNavigate('GAME_LANDING', { gameId: game.id })} // Navigate to Game Landing
              className="group bg-nexus-card border border-nexus-border rounded-xl p-3 cursor-pointer hover:border-nexus-primary transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-nexus-primary/10"
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 relative">
                 <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              </div>
              <h3 className="font-bold text-white text-sm truncate text-center group-hover:text-nexus-primary">{game.name}</h3>
              <p className="text-[10px] text-gray-500 text-center mt-1">1.2k Offers</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
