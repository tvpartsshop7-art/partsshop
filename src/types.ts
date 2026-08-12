export type Currency = 'INR' | 'USD';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'buyer' | 'seller';
  createdAt: string;
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
  category: 'eBook' | 'Guide' | 'Cheat Sheet' | 'Template' | 'Workbook' | 'Finance';
  rating: number;
  reviewCount: number;
  imageCover: string;
  pdfPageCount: number;
  pdfFileSize: string; // e.g. "4.8 MB"
  description: string;
  keyTakeaways: string[];
  tableOfContents: TableOfContentItem[];
  sampleTextPages: string[]; // text sample for interactive reader
  authorName: string;
  publishedYear: string;
  salesCount: number;
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
  items: CartItem[];
  totalAmountINR: number;
  totalAmountUSD: number;
  currency: Currency;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  paymentReference: string;
  downloadToken: string;
}
