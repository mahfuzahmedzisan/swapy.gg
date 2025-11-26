
import { Game, Listing, User, UserRole, Review, ChatMessage, Category, Platform, PlatformGroup, Banner } from './types';

// --- Configuration Data ---

export const PLATFORMS: Platform[] = [
  { id: 'p1', name: 'PC', icon: 'monitor' },
  { id: 'p2', name: 'Xbox Series X', icon: 'gamepad-2' },
  { id: 'p3', name: 'PS5', icon: 'gamepad' },
  { id: 'p4', name: 'Mobile', icon: 'smartphone' },
  { id: 'p5', name: 'Switch', icon: 'gamepad' },
];

export const PLATFORM_GROUPS: PlatformGroup[] = [
  { id: 'pg1', name: 'Consoles', platformIds: ['p2', 'p3', 'p5'] },
  { id: 'pg2', name: 'All Devices', platformIds: ['p1', 'p2', 'p3', 'p4', 'p5'] },
];

export const CATEGORIES: Category[] = [
  { 
    id: 'c1', name: 'Currency', slug: 'currency', layout: 'GROUPED_GIFT_CARD', isActive: true,
    seo: { metaTitle: 'Buy Game Currency', metaDescription: 'Cheap currency', keywords: ['gold', 'coins'] }
  },
  { 
    id: 'c2', name: 'Items', slug: 'items', layout: 'LIST_GRID', isActive: true,
    seo: { metaTitle: 'Buy In-Game Items', metaDescription: 'Rare skins and items', keywords: ['skins', 'weapons'] }
  },
  { 
    id: 'c3', name: 'Gift Cards', slug: 'gift-cards', layout: 'GROUPED_GIFT_CARD', isActive: true,
    seo: { metaTitle: 'Discounted Gift Cards', metaDescription: 'Steam, PSN cards', keywords: ['gift cards', 'codes'] }
  },
  { id: 'c4', name: 'Accounts', slug: 'accounts', layout: 'LIST_GRID', isActive: true, seo: { metaTitle: 'Buy Game Accounts', metaDescription: 'Stacked accounts', keywords: ['accounts', 'smurf'] } },
  { id: 'c5', name: 'Boosting', slug: 'boosting', layout: 'LIST_GRID', isActive: true, seo: { metaTitle: 'Game Boosting', metaDescription: 'Rank boost', keywords: ['boost', 'carry'] } },
  { id: 'c6', name: 'Top Ups', slug: 'top-ups', layout: 'GROUPED_GIFT_CARD', isActive: true, seo: { metaTitle: 'Mobile Top Up', metaDescription: 'Cheap top ups', keywords: ['top up', 'mobile'] } },
];

export const GAMES: Game[] = [
  { 
    id: '1', name: 'EA Sports FC 24', slug: 'fc24', image: 'https://picsum.photos/300/300?random=1', detailImage: 'https://images.unsplash.com/photo-1628151016005-4c07d3010b93?q=80&w=2070&auto=format&fit=crop',
    categoryIds: ['c1', 'c4', 'c5'], platformGroupId: 'pg2',
    categoryConfigs: {
      'c1': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] },
      'c4': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant', 'Manual'] },
      'c5': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] }
    }
  },
  { 
    id: '2', name: 'Fortnite', slug: 'fortnite', image: 'https://picsum.photos/300/300?random=2', detailImage: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?q=80&w=2070&auto=format&fit=crop',
    categoryIds: ['c2', 'c4', 'c3', 'c6'], platformGroupId: 'pg2',
    categoryConfigs: {
      'c4': { // Accounts
         listingFields: [
            { id: 'skin_count', label: 'Number of Skins', type: 'number', required: true, filterType: 'range' },
            { id: 'rare_skins', label: 'Rare Skins', type: 'select', options: ['Black Knight', 'Ikonik', 'Galaxy', 'Renegade Raider', 'None'], required: false, filterType: 'select' },
            { id: 'full_access', label: 'Full Access?', type: 'select', options: ['Yes', 'No'], required: true, filterType: 'select' }
         ],
         buyerFields: [],
         deliveryOptions: ['Instant', 'Manual']
      },
      'c3': { // Gift Cards
         listingFields: [
            { id: 'region', label: 'Card Region', type: 'select', options: ['Global', 'US', 'EU'], required: true, filterType: 'select' }
         ],
         buyerFields: [],
         deliveryOptions: ['Instant']
      },
      'c6': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant'] }, // Top ups
      'c2': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant', 'Manual'] } // Items
    }
  },
  { 
    id: '3', name: 'Diablo 4', slug: 'diablo4', image: 'https://picsum.photos/300/300?random=3', 
    categoryIds: ['c1', 'c2', 'c5'], platformGroupId: 'pg2',
    categoryConfigs: {
       'c1': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] },
       'c2': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] },
       'c5': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] }
    }
  },
  { 
    id: '4', name: 'WoW Dragonflight', slug: 'wow', image: 'https://picsum.photos/300/300?random=4', detailImage: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=2070&auto=format&fit=crop',
    categoryIds: ['c1', 'c4', 'c5'], platformGroupId: 'p1',
    categoryConfigs: {
      'c1': { // Currency
         listingFields: [
            { id: 'realm', label: 'Realm / Server', type: 'select', options: ['Silvermoon', 'Draenor', 'Kazzak'], required: true, filterType: 'select' },
            { id: 'faction', label: 'Faction', type: 'select', options: ['Alliance', 'Horde'], required: true, filterType: 'select' }
         ],
         buyerFields: [
             { id: 'char_name', label: 'Character Name', type: 'text', required: true }
         ],
         deliveryOptions: ['Manual']
      },
      'c4': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant', 'Manual'] },
      'c5': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] }
    }
  },
  { 
    id: '5', name: 'OSRS', slug: 'osrs', image: 'https://picsum.photos/300/300?random=5', 
    categoryIds: ['c1', 'c4', 'c5'], platformGroupId: 'p1',
    categoryConfigs: {
       'c1': { listingFields: [], buyerFields: [{id: 'rs_name', label: 'RSN', type:'text', required:true}], deliveryOptions: ['Manual'] },
       'c4': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant', 'Manual'] },
       'c5': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] }
    }
  },
  { 
    id: '6', name: 'Roblox', slug: 'roblox', image: 'https://picsum.photos/300/300?random=6', 
    categoryIds: ['c1', 'c4', 'c3', 'c6'], platformGroupId: 'pg2',
    categoryConfigs: {
       'c1': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] },
       'c4': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant'] },
       'c3': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant'] },
       'c6': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant'] }
    }
  },
  { 
    id: '7', name: 'Valorant', slug: 'valorant', image: 'https://picsum.photos/300/300?random=7', 
    categoryIds: ['c4', 'c5'], platformGroupId: 'p1',
    categoryConfigs: {
       'c4': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant', 'Manual'] },
       'c5': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] }
    }
  },
  { 
    id: '8', name: 'League of Legends', slug: 'lol', image: 'https://picsum.photos/300/300?random=8', 
    categoryIds: ['c4', 'c5', 'c3'], platformGroupId: 'p1',
    categoryConfigs: {
       'c4': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant', 'Manual'] },
       'c5': { listingFields: [], buyerFields: [], deliveryOptions: ['Manual'] },
       'c3': { listingFields: [], buyerFields: [], deliveryOptions: ['Instant'] }
    }
  },
];

export const MOCK_BANNERS: Banner[] = [
  { id: 'b1', title: 'Summer Sale', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', link: '#', active: true, position: 1 },
  { id: 'b2', title: 'New Arrivals', imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', link: '#', active: true, position: 2 },
];

export const CURRENT_USER: User = {
  id: 'u1',
  username: 'Max_238', // Randomly generated public ID format
  role: UserRole.USER,
  avatar: 'https://ui-avatars.com/api/?name=Max+238&background=8b5cf6&color=fff',
  status: 'Active',
  kycLevel: 'Silver',
  walletBalance: 1250.00,
  reputation: 5.0,
  totalSales: 0,
  isOnline: true,
  badges: ['verified_email']
};

export const MOCK_SELLERS: User[] = [
  {
    id: 's1',
    username: 'PixelStoreLAT',
    role: UserRole.SELLER,
    avatar: 'https://ui-avatars.com/api/?name=Pixel+Store&background=10b981&color=fff',
    status: 'Active',
    kycLevel: 'Gold',
    walletBalance: 5000,
    reputation: 99.3,
    totalSales: 2434,
    isOnline: true,
    badges: ['verified_id', 'fast_delivery']
  },
  {
    id: 's2',
    username: 'VictoryGamers',
    role: UserRole.SELLER,
    avatar: 'https://ui-avatars.com/api/?name=Victory+G&background=f59e0b&color=fff',
    status: 'Active',
    kycLevel: 'Silver',
    walletBalance: 200,
    reputation: 98.5,
    totalSales: 156,
    isOnline: false,
    badges: ['verified_phone']
  },
  {
    id: 's3',
    username: 'ProAccounts',
    role: UserRole.SELLER,
    avatar: 'https://ui-avatars.com/api/?name=Pro+Acc&background=ef4444&color=fff',
    status: 'Active',
    kycLevel: 'Gold',
    walletBalance: 1200,
    reputation: 100,
    totalSales: 50,
    isOnline: true,
    badges: ['verified_id']
  }
];

// Helper to generate random listings for every game/category combination
export const generateMockListings = (): Listing[] => {
  const listings: Listing[] = [];
  let idCounter = 1;

  GAMES.forEach(game => {
    game.categoryIds.forEach(catId => {
      const category = CATEGORIES.find(c => c.id === catId);
      if (!category) return;

      // Determine listing count
      const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 listings per combo

      for (let i = 0; i < count; i++) {
        const seller = MOCK_SELLERS[Math.floor(Math.random() * MOCK_SELLERS.length)];
        const platformGroup = PLATFORM_GROUPS.find(pg => pg.id === game.platformGroupId);
        const platformId = platformGroup 
          ? platformGroup.platformIds[Math.floor(Math.random() * platformGroup.platformIds.length)]
          : PLATFORMS[0].id;

        let title = '';
        let price = 0;
        let image = game.image; // Default to game image
        let unit = 'Unit';
        let customValues = {}; // Mock custom data

        // Custom Logic for realistic titles based on Category
        if (category.slug === 'accounts') {
           const types = ['Stacked', 'Smurf', 'Ranked Ready', 'Rare Skins'];
           const type = types[Math.floor(Math.random() * types.length)];
           title = `${game.name} | ${type} Account | Level ${Math.floor(Math.random() * 500)}`;
           price = Math.floor(Math.random() * 500) + 20;
           unit = 'Account';

           // Mock Data for Fortnite Accounts specifically to test filters
           if (game.slug === 'fortnite') {
              customValues = {
                  skin_count: Math.floor(Math.random() * 300) + 10,
                  rare_skins: Math.random() > 0.5 ? 'Black Knight' : (Math.random() > 0.5 ? 'Ikonik' : 'None'),
                  full_access: Math.random() > 0.2 ? 'Yes' : 'No'
              }
           }
        } else if (category.slug === 'currency') {
           const amounts = ['100k', '500k', '1M', '10M'];
           const amount = amounts[Math.floor(Math.random() * amounts.length)];
           title = `${amount} ${game.name} Coins`;
           price = Math.floor(Math.random() * 50) + 5;
           unit = amount;
        } else if (category.slug === 'gift-cards' || category.slug === 'top-ups') {
           const values = [10, 20, 50, 100];
           const val = values[Math.floor(Math.random() * values.length)];
           title = `$${val} Gift Card`;
           price = val * (0.9 + (Math.random() * 0.2)); // Price fluctuates around value
           unit = 'Card';
        } else if (category.slug === 'items') {
           title = `Rare Item #${idCounter}`;
           price = Math.floor(Math.random() * 100) + 10;
        } else {
           title = `Professional Boost Service`;
           price = 30;
           unit = 'Service';
        }

        listings.push({
          id: `gen_${idCounter++}`,
          gameId: game.id,
          categoryId: category.id,
          title: title,
          description: `Instant delivery for ${title}. Best price on the market. Secure transfer.`,
          image: image,
          price: Number(price.toFixed(2)),
          unit: unit,
          stock: Math.floor(Math.random() * 50) + 1,
          minQty: 1,
          sellerId: seller.id,
          seller: seller,
          deliveryType: Math.random() > 0.3 ? 'Instant' : 'Manual',
          deliveryTime: Math.random() > 0.3 ? 'Instant' : '1 Hour',
          platformId: platformId,
          region: Math.random() > 0.5 ? 'Global' : (Math.random() > 0.5 ? 'US' : 'Europe'),
          tags: ['Verified', 'Secure', 'Fast'],
          customValues: customValues
        });
      }
    });
  });

  return listings;
};

export const LISTINGS: Listing[] = generateMockListings();

export const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Yeg***', rating: 'Positive', text: 'Fast delivery, everything works.', date: '24.10.25', itemName: 'Blue Squire Skin' },
  { id: '2', author: 'Ale***', rating: 'Positive', text: 'Good seller.', date: '23.10.25', itemName: '5000 V-Bucks' },
  { id: '3', author: 'Sam***', rating: 'Negative', text: 'Did not respond in 24 hours.', date: '20.10.25', itemName: 'Galaxy Skin' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { id: '1', senderId: 's1', text: 'Hi, what is the problem?', timestamp: 'Oct-20-2025 10:30 AM' },
  { id: '2', senderId: 'u1', text: 'Please cancel the order, I don\'t want it anymore.', timestamp: 'Oct-20-2025 10:32 AM' },
  { id: '3', senderId: 's1', text: 'Okay', timestamp: 'Oct-20-2025 10:35 AM' },
];

export const MOCK_KYC_REQUESTS = [
    { id: 'k1', userId: 'u2', username: 'NewSeller_99', type: 'ID Card', status: 'Pending', submittedAt: '2025-10-21' },
    { id: 'k2', userId: 'u3', username: 'GamerX', type: 'Selfie', status: 'Pending', submittedAt: '2025-10-22' }
];

export const MOCK_WITHDRAWALS = [
    { id: 'w1', sellerId: 's1', username: 'PixelStoreLAT', amount: 500.00, method: 'Payoneer', status: 'Pending', date: '2025-10-20' },
    { id: 'w2', sellerId: 's2', username: 'VictoryGamers', amount: 150.00, method: 'Crypto', status: 'Pending', date: '2025-10-21' }
];