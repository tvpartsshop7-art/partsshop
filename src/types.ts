export type Currency = 'INR' | 'USD';

export interface User {
  id: string;
  name: string;
  technicianName?: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  aadharNumber?: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  totalPurchases?: number;
  totalSpentINR?: number;
  totalDownloads?: number;
  createdAt: string;
  lastLogin?: string;
}

export interface TableOfContentItem {
  pageNumber: number;
  title: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  priceINR: number;
  priceUSD: number;
  originalPriceINR: number;
  originalPriceUSD: number;
  discountPercent?: number;
  expiresIn?: string; // e.g. "Lifetime Access", "30 Days Validity", "Flash Sale: 24h", "Valid till 31 Dec 2026"
  category: 'eBook' | 'Guide' | 'Cheat Sheet' | 'Template' | 'Workbook' | 'Finance' | string;
  rating: number;
  reviewCount: number;
  imageCover: string;
  pdfPageCount: number;
  pdfFileSize: string; // e.g. "4.8 MB"
  pdfFileName?: string;
  localPdfDataUrl?: string;
  description: string;
  keyTakeaways: string[];
  tableOfContents: TableOfContentItem[];
  sampleTextPages: string[]; // text sample for interactive reader
  authorName: string;
  publishedYear: string;
  salesCount: number;
  isActive?: boolean; // toggle visibility on store
  isFeatured?: boolean;
  createdAt?: string;
  reviews?: Review[];
  customPdfContent?: {
    chapters: { title: string; content: string[] }[];
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  totalAmountINR: number;
  totalAmountUSD: number;
  currency: Currency;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  paymentReference: string;
  downloadToken: string;
  downloadCount?: number;
  status?: 'completed' | 'pending' | 'refunded';
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercent: number;
  minAmountINR: number;
  isActive: boolean;
  expiryDate: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  announcementText: string;
  announcementActive: boolean;
  coupons: CouponCode[];
  supportEmail: string;
  upiId: string;
  allowGuestCheckout: boolean;
}

