import { StoreSettings } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'PartsShop Digital Library',
  storeTagline: 'Premium Technical Guides, Schematics & E-Books with Instant Delivery',
  announcementText: '🔥 Mega Launch Deal: Use code "PARTS30" for Flat 30% OFF on all PDF Guides & Schematics!',
  announcementActive: true,
  supportEmail: 'support@partsshop.com',
  upiId: 'samtech@upi',
  allowGuestCheckout: true,
  coupons: [
    {
      id: 'cp-01',
      code: 'PARTS30',
      discountPercent: 30,
      minAmountINR: 299,
      isActive: true,
      expiryDate: '2026-12-31'
    },
    {
      id: 'cp-02',
      code: 'WELCOME50',
      discountPercent: 50,
      minAmountINR: 499,
      isActive: true,
      expiryDate: '2026-12-31'
    },
    {
      id: 'cp-03',
      code: 'FLASH20',
      discountPercent: 20,
      minAmountINR: 199,
      isActive: true,
      expiryDate: '2026-10-31'
    }
  ]
};
