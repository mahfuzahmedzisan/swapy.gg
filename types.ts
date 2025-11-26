

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

export enum OrderStatus {
  PENDING = 'Pending',
  VERIFYING = 'Verifying',
  DELIVERING = 'In Delivery',
  COMPLETED = 'Completed',
  DISPUTED = 'Disputed',
  CANCELLED = 'Cancelled'
}

export type CategoryType = 'Currency' | 'Items' | 'Accounts' | 'Boosting' | 'Top Ups' | 'Gift Cards';
export type CategoryLayout = 'LIST_GRID' | 'GROUPED_GIFT_CARD';

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  layout: CategoryLayout;
  seo: SEOSettings;
  isActive: boolean;
}

export interface PlatformGroup {
  id: string;
  name: string; // e.g., "Consoles"
  platformIds: string[];
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  username: string; // Randomly generated public ID e.g. Max_238
  email?: string; // Private
  role: UserRole;
  avatar: string; // Default random avatar
  status: 'Active' | 'Banned' | 'Suspended';
  kycLevel: 'None' | 'Bronze' | 'Silver' | 'Gold';
  walletBalance: number;
  reputation: number;
  totalSales: number;
  isOnline: boolean;
  badges: string[];
}

// Configuration for dynamic fields (e.g. "Server", "Skin Rarity")
export interface CustomFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number';
  options?: string[]; // CSV for select options
  required: boolean;
  filterType?: 'none' | 'range' | 'select'; // New: Determines how this field is filtered in the marketplace
}

export interface GameVariant {
  id: string;
  name: string; // e.g. "1000 V-Bucks"
  image?: string; // Specific image for this product variant
  subtitle?: string; // e.g. "V-Bucks", "Points", "Gold"
}

export interface GameCategoryConfig {
  listingFields: CustomFieldConfig[]; // Fields the SELLER must fill
  buyerFields: CustomFieldConfig[];   // Fields the BUYER must fill
  deliveryOptions: ('Instant' | 'Manual')[]; // Allowed delivery types for this specific category
  predefinedVariants?: GameVariant[]; // NEW: If present, seller MUST choose one of these instead of typing title
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  image: string;
  detailImage?: string; // Banner image for product/landing pages
  categoryIds: string[]; // List of enabled categories
  platformGroupId?: string; // Links to a group of platforms (Xbox, PSN, etc)
  seo?: SEOSettings;
  
  // New: Configuration keyed by Category ID
  categoryConfigs: Record<string, GameCategoryConfig>;
}

export interface Listing {
  id: string;
  gameId: string;
  categoryId: string;
  title: string;
  description: string;
  image?: string; // Specific image for the item (used in Grouped View)
  price: number;
  unit: string; // e.g., "100k", "1 unit"
  stock: number;
  minQty: number;
  sellerId: string;
  seller: User;
  deliveryType: 'Instant' | 'Manual' | 'Auto-Delivery';
  deliveryTime: string; // "20 mins"
  platformId?: string; // Specific platform for this listing
  region?: string; // e.g., "Global", "Europe", "US"
  server?: string;
  tags: string[];
  status?: string; // e.g. Active, Sold Out
  
  // Dynamic Values filled by Seller based on Game.categoryConfigs[catId].listingFields
  customValues?: Record<string, string | number>; 
  
  variantId?: string; // Link to the predefined variant if applicable
}

export interface Order {
  id: string;
  listing: Listing;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  buyerId: string;
  createdAt: string;
  disputeReason?: string;
  
  // Dynamic Values filled by Buyer based on Game.categoryConfigs[catId].buyerFields
  buyerInputValues?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: 'Positive' | 'Negative';
  text: string;
  date: string;
  itemName: string;
  status?: 'Approved' | 'Flagged';
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  active: boolean;
  position: number;
}

// --- New Types for Admin Features ---

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  type: 'Technical' | 'Billing' | 'Account' | 'Report';
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  lastUpdate: string;
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Sale' | 'Purchase' | 'Fee';
  amount: number;
  user: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Rejected';
  date: string;
  method?: string;
}

export interface KYCRequest {
  id: string;
  userId: string;
  username: string;
  type: 'ID Card' | 'Passport' | 'Selfie';
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  images: string[];
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  username: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  date: string;
}

// New Admin Modules Types
export interface Dispute {
    id: string;
    orderId: string;
    buyer: string;
    seller: string;
    reason: string;
    status: 'Open' | 'Resolved' | 'Closed';
    createdAt: string;
}

export interface StaffMember {
    id: string;
    username: string;
    role: 'Admin' | 'Moderator' | 'Support';
    lastActive: string;
}

export interface Affiliate {
    id: string;
    code: string;
    user: string;
    earnings: number;
    referrals: number;
}

export interface SystemLog {
    id: string;
    action: string;
    admin: string;
    ip: string;
    timestamp: string;
    level: 'Info' | 'Warning' | 'Error';
}

export interface Coupon {
    id: string;
    code: string;
    discount: number; // percentage or fixed
    type: 'Percentage' | 'Fixed';
    uses: number;
    maxUses: number;
    status: 'Active' | 'Expired';
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    interval: 'Monthly' | 'Yearly';
    activeSubscribers: number;
}

export interface AdminTask {
    id: string;
    text: string;
    status: 'Todo' | 'Done';
    assignedTo?: string;
}

export interface KnowledgeBaseArticle {
    id: string;
    title: string;
    category: string;
    views: number;
    status: 'Published' | 'Draft';
}

export interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    cost: number;
    supplier: string;
}

export interface TaxRule {
    id: string;
    country: string;
    rate: number;
    type: 'Digital Goods' | 'Service';
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    source: string;
    status: 'New' | 'Contacted' | 'Converted';
}

export interface Partner {
    id: string;
    company: string;
    contact: string;
    status: 'Active' | 'Inactive';
}

export interface Campaign {
    id: string;
    name: string;
    budget: number;
    clicks: number;
    status: 'Active' | 'Paused';
}

export interface ABTest {
    id: string;
    feature: string;
    variantA: string;
    variantB: string;
    status: 'Running' | 'Ended';
}

export interface CMSPage {
    id: string;
    title: string;
    slug: string;
    lastEdited: string;
}

export interface MediaItem {
    id: string;
    name: string;
    url: string;
    size: string;
}

export interface ThemeConfig {
    id: string;
    name: string;
    mode: 'dark' | 'light';
    active: boolean;
    colors: {
        main: string;
        card: string;
        primary: string;
        border: string;
    }
}

export interface Plugin {
    id: string;
    name: string;
    version: string;
    status: 'Active' | 'Inactive';
}

export interface Webhook {
    id: string;
    url: string;
    events: string[];
    status: 'Active' | 'Failed';
}

export interface ApiKey {
    id: string;
    key: string; // partially hidden
    service: string;
    lastUsed: string;
}

export interface Backup {
    id: string;
    filename: string;
    size: string;
    date: string;
}

export interface CronJob {
    id: string;
    name: string;
    schedule: string;
    lastRun: string;
    status: 'Success' | 'Fail';
}

export type ViewState = 'HOME' | 'GAME_SELECTION' | 'GAME_LANDING' | 'LISTINGS' | 'PRODUCT' | 'CHECKOUT' | 'ORDER_DETAIL' | 'SELLER_PROFILE' | 'ADMIN' | 'BUYER_DASHBOARD' | 'SELLER_DASHBOARD';