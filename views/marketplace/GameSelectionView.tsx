

import React, { useState } from 'react';
import { Gamepad2, Search, Flame, Sparkles, Box } from 'lucide-react';
import { Game, Category } from '../../types';
import { Badge, Breadcrumbs } from '../../components/UIComponents';

interface GameSelectionProps {
  category?: Category;
  games: Game[];
  onNavigate: (view: any, data?: any) => void;
  isDevMode?: boolean;
}

export const GameSelectionView: React.FC<GameSelectionProps> = ({ category, games, onNavigate, isDevMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter by Category
  const categoryGames = games.filter(g => category ? g.categoryIds.includes(category.id) : true);

  // 2. Filter by Search Query
  const filteredGames = categoryGames.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Slice into sections (Mock logic)
  const newArrivals = filteredGames.slice(0, 2);
  const popularGames = filteredGames.slice(2, 6);
  const allGames = filteredGames; // Show all in bottom section for completeness

  const GameCard = ({ game }: { game: Game }) => (
    <div 
      onClick={() => onNavigate('LISTINGS', { gameId: game.id, category })}
      className="group bg-nexus-card border border-nexus-border rounded-2xl overflow-hidden cursor-pointer hover:border-nexus-primary transition-all hover:-translate-y-1 hover:shadow-lg relative"
    >
      <div className="aspect-[4/5]">
          <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-card via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-nexus-primary">{game.name}</h3>
            <div className="flex items-center mt-2">
                <Badge variant="outline" className="text-[10px] bg-black/50 backdrop-blur-md border-white/10">View Offers</Badge>
            </div>
          </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[60vh]">
      <Breadcrumbs items={['Home', category?.name || 'Selection']} />
      
      <div className="text-center max-w-2xl mx-auto mb-8">
         <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Select Game for {category?.name}</h1>
         <p className="text-gray-400 mb-8">Choose a game below to find the best deals on {category?.name?.toLowerCase()}. Safe & secure.</p>
         
         {/* Scoped Search */}
         <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder={`Search ${category?.name || 'games'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-nexus-card border border-nexus-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary transition-all shadow-lg"
            />
         </div>
      </div>

      {filteredGames.length > 0 ? (
        <div className="space-y-12">
           {/* New Arrivals Section */}
           {newArrivals.length > 0 && !searchQuery && (
             <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="text-yellow-400" size={20}/> New Arrivals</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {newArrivals.map(game => <GameCard key={game.id} game={game} />)}
                </div>
             </section>
           )}

           {/* Popular Section */}
           {popularGames.length > 0 && !searchQuery && (
             <section>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Flame className="text-orange-500" size={20}/> Popular Now</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {popularGames.map(game => <GameCard key={game.id} game={game} />)}
                </div>
             </section>
           )}

           {/* All Games Section */}
           <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Box className="text-nexus-primary" size={20}/> {searchQuery ? 'Search Results' : 'All Games'}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {allGames.map(game => <GameCard key={game.id} game={game} />)}
              </div>
           </section>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-nexus-card rounded-lg border border-nexus-border border-dashed">
          <Gamepad2 className="mx-auto mb-4 opacity-50" size={48} />
          <p>No games found matching "{searchQuery}".</p>
        </div>
      )}
    </div>
  );
};