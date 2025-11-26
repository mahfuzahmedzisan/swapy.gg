

import React, { useState } from 'react';
import { 
  Users, Shield, Box, DollarSign, Headphones, Tag, Server, LayoutDashboard,
  Code, Gavel, Handshake, Share2, Filter, Star, ShieldCheck, Fingerprint, Lock,
  ClipboardList, Database, Cpu, Hammer, Webhook, Puzzle, List, Bell,
  ChartLine, FileBarChart, Radio, PieChart, Users2, FileText,
  Languages, Globe, Image, BookOpen, Palette, Repeat, Megaphone, Flag, Zap, Percent,
  MessageSquare
} from 'lucide-react';
import { User, Game, Category, Platform, PlatformGroup, Banner } from '../types';

// Import New Managers (Functionality Upgrade)
import { DashboardModule } from './admin/DashboardModule';
import { CatalogManager } from './admin/CatalogManager';
import { FinanceManager } from './admin/FinanceManager';
import { UsersManager } from './admin/UsersManager';
import { SupportManager } from './admin/SupportManager';
import { MarketingManager } from './admin/MarketingManager';
import { ContentManager } from './admin/ContentManager';
import { SystemManager } from './admin/SystemManager';

interface AdminViewProps {
  users: User[];
  games: Game[];
  categories: Category[];
  platforms: Platform[];
  platformGroups: PlatformGroup[];
  banners?: Banner[];
  onUpdateUser: (user: User) => void;
  onSaveGame: (game: Game) => void;
  onDeleteGame: (id: string) => void;
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  onSavePlatformGroup: (pg: PlatformGroup) => void;
  onSaveBanner?: (banner: Banner) => void;
  onDeleteBanner?: (id: string) => void;
  isDevMode?: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
   users, games, categories, platforms, platformGroups, banners,
   onUpdateUser, onSaveGame, onDeleteGame, onSaveCategory, onDeleteCategory, onSaveBanner, onDeleteBanner,
   isDevMode
}) => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
      <button 
        onClick={() => setActiveTab(id)} 
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all font-medium text-xs mb-0.5 ${
            activeTab === id 
            ? 'bg-nexus-primary text-white shadow-lg shadow-nexus-primary/20' 
            : 'text-gray-400 hover:text-white hover:bg-nexus-hover'
        }`}
      >
        <div className="flex items-center">
            <Icon size={14} className="mr-3" /> {label}
        </div>
      </button>
  );

  const SectionTitle = ({ title }: { title: string }) => (
      <div className="px-3 pt-4 pb-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest opacity-80">{title}</div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 min-h-[85vh]">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="lg:col-span-1">
         <div className="sticky top-24 bg-nexus-card border border-nexus-border rounded-2xl p-2 shadow-xl flex flex-col h-[calc(100vh-120px)] overflow-hidden">
             <div className="flex items-center gap-3 mb-2 px-3 pt-3">
                <div className="w-8 h-8 bg-nexus-primary rounded-lg flex items-center justify-center text-white shadow-lg">
                    <Shield size={16} />
                </div>
                <div><h3 className="font-bold text-white text-sm">Admin Panel</h3></div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
                 <SectionTitle title="Main" />
                 <SidebarItem id="DASHBOARD" label="Dashboard" icon={LayoutDashboard} />
                 
                 <SectionTitle title="Catalog" />
                 <SidebarItem id="CATALOG_GAMES" label="Games" icon={Box} />
                 <SidebarItem id="CATALOG_CATEGORIES" label="Categories" icon={Box} />
                 <SidebarItem id="CATALOG_PLATFORMS" label="Platforms" icon={Server} />

                 <SectionTitle title="Users & Staff" />
                 <SidebarItem id="USERS_USERS" label="Users" icon={Users} />
                 <SidebarItem id="USERS_STAFF" label="Staff" icon={Users2} />
                 <SidebarItem id="USERS_AFFILIATES" label="Affiliates" icon={Share2} />

                 <SectionTitle title="Finance" />
                 <SidebarItem id="FINANCE_TRANSACTIONS" label="Transactions" icon={DollarSign} />
                 <SidebarItem id="FINANCE_WITHDRAWALS" label="Withdrawals" icon={DollarSign} />
                 <SidebarItem id="FINANCE_SUBSCRIPTIONS" label="Subscriptions" icon={Repeat} />
                 <SidebarItem id="FINANCE_ESCROW" label="Escrow" icon={Handshake} />
                 <SidebarItem id="FINANCE_SETTINGS" label="Fee Settings" icon={Percent} />

                 <SectionTitle title="Support" />
                 <SidebarItem id="SUPPORT_TICKETS" label="Tickets" icon={Headphones} />
                 <SidebarItem id="SUPPORT_RESPONSES" label="Canned Replies" icon={MessageSquare} />
                 <SidebarItem id="SUPPORT_KYC" label="KYC Verify" icon={ShieldCheck} />
                 <SidebarItem id="SUPPORT_DISPUTES" label="Disputes" icon={Gavel} />
                 <SidebarItem id="SUPPORT_REVIEWS" label="Reviews" icon={Star} />

                 <SectionTitle title="Marketing" />
                 <SidebarItem id="MARKETING_COUPONS" label="Coupons" icon={Tag} />
                 <SidebarItem id="MARKETING_CAMPAIGNS" label="Campaigns" icon={Radio} />
                 <SidebarItem id="MARKETING_FLASH_SALES" label="Flash Sales" icon={Zap} />
                 <SidebarItem id="MARKETING_REFERRALS" label="Referral Settings" icon={Share2} />

                 <SectionTitle title="Content" />
                 <SidebarItem id="CONTENT_CMS" label="Pages" icon={FileText} />
                 <SidebarItem id="CONTENT_KB" label="Knowledge Base" icon={BookOpen} />
                 <SidebarItem id="CONTENT_BANNERS" label="Banners" icon={Megaphone} />
                 <SidebarItem id="CONTENT_MEDIA" label="Media" icon={Image} />
                 <SidebarItem id="CONTENT_THEMES" label="Themes" icon={Palette} />
                 <SidebarItem id="CONTENT_EMAILS" label="Email Tpl" icon={List} />
                 <SidebarItem id="CONTENT_SEO" label="SEO" icon={Globe} />
                 <SidebarItem id="CONTENT_LOCALIZATION" label="Localization" icon={Languages} />

                 <SectionTitle title="System" />
                 <SidebarItem id="SYSTEM_LOGS" label="Logs" icon={ClipboardList} />
                 <SidebarItem id="SYSTEM_SECURITY" label="Security" icon={Lock} />
                 <SidebarItem id="SYSTEM_DATABASE" label="Database" icon={Database} />
                 <SidebarItem id="SYSTEM_CACHE" label="Cache" icon={Cpu} />
                 <SidebarItem id="SYSTEM_BACKUPS" label="Backups" icon={Database} />
                 <SidebarItem id="SYSTEM_MAINTENANCE" label="Maintenance" icon={Hammer} />
                 <SidebarItem id="SYSTEM_INFO" label="System Info" icon={Server} />

                 <SectionTitle title="Dev Tools" />
                 <SidebarItem id="SYSTEM_DEVELOPERS" label="API Keys" icon={Code} />
                 <SidebarItem id="SYSTEM_WEBHOOKS" label="Webhooks" icon={Webhook} />
                 <SidebarItem id="SYSTEM_PLUGINS" label="Plugins" icon={Puzzle} />
                 <SidebarItem id="SYSTEM_IP_WHITELIST" label="IP Whitelist" icon={List} />
                 <SidebarItem id="SYSTEM_INTEGRATIONS" label="Integrations" icon={Puzzle} />
                 <SidebarItem id="SYSTEM_NOTIFICATIONS" label="Push Notif" icon={Bell} />
                 
                 <SectionTitle title="Analytics" />
                 <SidebarItem id="ANALYTICS_CHARTS" label="Charts" icon={ChartLine} />
                 <SidebarItem id="ANALYTICS_REPORTS" label="Reports" icon={FileBarChart} />
             </div>
         </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="lg:col-span-5">
          {activeTab === 'DASHBOARD' && <DashboardModule />}
          
          {/* CATALOG */}
          {activeTab.startsWith('CATALOG_') && (
              <CatalogManager 
                  subTab={activeTab.split('_')[1]}
                  games={games} categories={categories} platforms={platforms}
                  onSaveGame={onSaveGame} onDeleteGame={onDeleteGame}
                  onSaveCategory={onSaveCategory} onDeleteCategory={onDeleteCategory}
                  onSavePlatform={() => {}} 
              />
          )}

          {/* FINANCE */}
          {activeTab.startsWith('FINANCE_') && <FinanceManager subTab={activeTab.split('_')[1]} />}

          {/* USERS */}
          {activeTab.startsWith('USERS_') && <UsersManager subTab={activeTab.split('_')[1]} users={users} onUpdateUser={onUpdateUser} />}

          {/* SUPPORT */}
          {activeTab.startsWith('SUPPORT_') && <SupportManager subTab={activeTab.split('_')[1]} />}

          {/* MARKETING */}
          {activeTab.startsWith('MARKETING_') && <MarketingManager subTab={activeTab.split('_')[1]} />}

          {/* CONTENT */}
          {activeTab.startsWith('CONTENT_') && (
              <ContentManager 
                  subTab={activeTab.split('_')[1]} 
                  banners={banners || []} 
                  onSaveBanner={onSaveBanner || (() => {})} 
                  onDeleteBanner={onDeleteBanner || (() => {})} 
              />
          )}

          {/* SYSTEM & DEV */}
          {activeTab.startsWith('SYSTEM_') && <SystemManager subTab={activeTab.split('_')[1]} />}

          {/* Placeholder for others */}
          {activeTab.startsWith('ANALYTICS_') && <div className="text-white p-8">Analytics Module Loaded</div>}
      </div>
    </div>
  );
};
