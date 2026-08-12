import { Order } from '../types';
import { MOCK_PRODUCTS } from './mockProducts';

export const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8941',
    date: '2026-08-12T14:32:00Z',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1
      }
    ],
    totalAmountINR: 499,
    totalAmountUSD: 9.99,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentReference: 'UPI-REF-992384102',
    downloadToken: 'DL-8823-9912-7711',
    downloadCount: 3,
    status: 'completed'
  },
  {
    id: 'ORD-2026-8930',
    date: '2026-08-12T11:15:00Z',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@techworld.in',
    customerPhone: '+91 98234 56789',
    items: [
      {
        product: MOCK_PRODUCTS[1],
        quantity: 1
      }
    ],
    totalAmountINR: 399,
    totalAmountUSD: 7.99,
    currency: 'INR',
    paymentMethod: 'card',
    paymentReference: 'TXN-CARD-448192',
    downloadToken: 'DL-5541-1123-9932',
    downloadCount: 2,
    status: 'completed'
  },
  {
    id: 'ORD-2026-8912',
    date: '2026-08-11T19:45:00Z',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@devstudio.com',
    customerPhone: '+91 91234 11223',
    items: [
      {
        product: MOCK_PRODUCTS[2] || MOCK_PRODUCTS[0],
        quantity: 1
      },
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1
      }
    ],
    totalAmountINR: 798,
    totalAmountUSD: 15.98,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentReference: 'UPI-REF-771829341',
    downloadToken: 'DL-1192-3341-8891',
    downloadCount: 5,
    status: 'completed'
  },
  {
    id: 'ORD-2026-8890',
    date: '2026-08-10T16:20:00Z',
    customerName: 'Vikram Verma',
    customerEmail: 'vikram.verma@electronicslab.org',
    customerPhone: '+91 99887 76655',
    items: [
      {
        product: MOCK_PRODUCTS[3] || MOCK_PRODUCTS[1],
        quantity: 1
      }
    ],
    totalAmountINR: 599,
    totalAmountUSD: 11.99,
    currency: 'INR',
    paymentMethod: 'netbanking',
    paymentReference: 'NET-HDFC-99120',
    downloadToken: 'DL-7734-1182-9901',
    downloadCount: 1,
    status: 'completed'
  },
  {
    id: 'ORD-2026-8875',
    date: '2026-08-09T13:10:00Z',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.deshmukh@gmail.com',
    customerPhone: '+91 97654 32109',
    items: [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1
      }
    ],
    totalAmountINR: 499,
    totalAmountUSD: 9.99,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentReference: 'UPI-REF-33219084',
    downloadToken: 'DL-4491-7782-2291',
    downloadCount: 4,
    status: 'completed'
  }
];
