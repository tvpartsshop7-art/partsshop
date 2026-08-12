import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'buyer',
    status: 'active',
    totalPurchases: 4,
    totalSpentINR: 1996,
    totalDownloads: 12,
    createdAt: '2026-01-15T10:30:00Z',
    lastLogin: '2026-08-11T18:40:00Z'
  },
  {
    id: 'user-002',
    name: 'Priya Patel',
    email: 'priya.patel@techworld.in',
    phone: '+91 98234 56789',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'buyer',
    status: 'active',
    totalPurchases: 2,
    totalSpentINR: 998,
    totalDownloads: 6,
    createdAt: '2026-02-20T14:15:00Z',
    lastLogin: '2026-08-10T11:20:00Z'
  },
  {
    id: 'user-003',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@devstudio.com',
    phone: '+91 91234 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'buyer',
    status: 'active',
    totalPurchases: 6,
    totalSpentINR: 3294,
    totalDownloads: 18,
    createdAt: '2026-03-05T09:00:00Z',
    lastLogin: '2026-08-12T08:15:00Z'
  },
  {
    id: 'user-004',
    name: 'Vikram Verma',
    email: 'vikram.verma@electronicslab.org',
    phone: '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'buyer',
    status: 'active',
    totalPurchases: 1,
    totalSpentINR: 499,
    totalDownloads: 3,
    createdAt: '2026-04-12T16:45:00Z',
    lastLogin: '2026-08-09T19:00:00Z'
  },
  {
    id: 'user-005',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@gmail.com',
    phone: '+91 97654 32109',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'buyer',
    status: 'active',
    totalPurchases: 3,
    totalSpentINR: 1497,
    totalDownloads: 8,
    createdAt: '2026-05-18T12:00:00Z',
    lastLogin: '2026-08-12T14:30:00Z'
  },
  {
    id: 'user-admin-01',
    name: 'Master Administrator',
    email: 'admin@partsshop.com',
    phone: '+91 99999 00000',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    status: 'active',
    totalPurchases: 0,
    totalSpentINR: 0,
    totalDownloads: 0,
    createdAt: '2026-01-01T00:00:00Z',
    lastLogin: '2026-08-12T15:00:00Z'
  }
];
