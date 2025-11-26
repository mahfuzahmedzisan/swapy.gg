

import React from 'react';
import { Game, Category } from '../../types';
import { Breadcrumbs, Card } from '../../components/UIComponents';
import { Zap, Shield, Gift, Package, User, Coins, ChevronRight } from 'lucide-react';

interface GameLandingViewProps {
  game?: Game;
  categories: Category[];
  onNavigate: (view: any, data?: any) => void;
  isDevMode?: boolean;
}

export const GameLandingView: React.FC<GameLandingViewProps> = ({ game, categories, onNavigate, isDevMode }) => {
  if (!game) return <div>Game not found</div>;

  const availableCategories = categories.filter(c => game.categoryIds.includes(c.id));

  const getIcon = (slug: string) => {
      switch(slug) {
          case 'accounts': return User;
          case 'currency': return Coins;
          case 'items': return Package;
          case 'boosting': return Zap;
          case 'gift-cards': return Gift;
          case 'top-ups': return Zap;
          default: return Shield;
      }
  }

  return (
    <div className="space-y-8 min-h-[60vh]">
        <Breadcrumbs items={['Home', game.name]} />

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center border border-nexus-border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518] to-transparent z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: `url(${game.detailImage || game.image})`}}></div>
            <div className="relative z-20 px-8 md:px-12">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{game.name}</h1>
                <p className="text-xl text-gray-300 max-w-lg">Select a category below to browse offers for {game.name}.</p>
            </div>
        </div>

        {/* Categories Grid */}
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Available Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCategories.map(cat => {
                    const Icon = getIcon(cat.slug);
                    return (
                        <div 
                            key={cat.id}
                            onClick={() => onNavigate('LISTINGS', { gameId: game.id, category: cat })}
                            className="bg-nexus-card border border-nexus-border rounded-xl p-6 hover:border-nexus-primary cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-nexus-primary/10 flex items-center justify-center text-nexus-primary group-hover:bg-nexus-primary group-hover:text-white transition-colors">
                                    <Icon size={24} />
                                </div>
                                <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                            <p className="text-sm text-gray-400">Browse thousands of {cat.name.toLowerCase()} for {game.name} with instant delivery.</p>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};