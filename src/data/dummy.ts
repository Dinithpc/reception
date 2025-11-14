import { Booking, Customer, Payment, DashboardStats } from '@/types';
import { addDays, subDays, format } from 'date-fns';

const today = new Date();

export const dummyBookings: Booking[] = [
  {
    id: 'book-001',
    customerName: 'Kasun Perera',
    customerEmail: 'kasun.perera@example.com',
    customerPhone: '+94 71 123 4567',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    timeSlot: '09:00 - 13:00',
    eventType: 'Wedding Reception',
    guestCount: 200,
    totalAmount: 450000,
    advanceAmount: 150000,
    paymentStatus: 'advance',
    paymentMethod: 'card',
    status: 'confirmed',
    notes: 'Poruwa setup and traditional dancing',
    createdAt: format(subDays(today, 5), 'yyyy-MM-dd'),
    updatedAt: format(subDays(today, 2), 'yyyy-MM-dd'),
  },
  {
    id: 'book-002',
    customerName: 'Nimasha Fernando',
    customerEmail: 'nimasha.f@example.com',
    customerPhone: '+94 76 987 6543',
    date: format(addDays(today, 7), 'yyyy-MM-dd'),
    timeSlot: '18:00 - 22:00',
    eventType: 'Birthday Party',
    guestCount: 80,
    totalAmount: 120000,
    advanceAmount: 120000,
    paymentStatus: 'full',
    paymentMethod: 'bank_transfer',
    status: 'confirmed',
    notes: 'Need DJ and lighting setup',
    createdAt: format(subDays(today, 10), 'yyyy-MM-dd'),
    updatedAt: format(subDays(today, 8), 'yyyy-MM-dd'),
  },
  {
    id: 'book-003',
    customerName: 'Tharaka Jayasinghe',
    customerEmail: 'tharaka.j@example.com',
    customerPhone: '+94 77 222 3344',
    date: format(addDays(today, 14), 'yyyy-MM-dd'),
    timeSlot: '13:00 - 17:00',
    eventType: 'Corporate Event',
    guestCount: 100,
    totalAmount: 250000,
    advanceAmount: 75000,
    paymentStatus: 'advance',
    paymentMethod: 'cash',
    status: 'confirmed',
    notes: 'Projector and PA system required',
    createdAt: format(subDays(today, 3), 'yyyy-MM-dd'),
    updatedAt: format(subDays(today, 3), 'yyyy-MM-dd'),
  },
  {
    id: 'book-004',
    customerName: 'Dilini Weerasinghe',
    customerEmail: 'dilini.w@example.com',
    customerPhone: '+94 70 555 8899',
    date: format(addDays(today, 21), 'yyyy-MM-dd'),
    timeSlot: '09:00 - 13:00',
    eventType: 'Anniversary',
    guestCount: 60,
    totalAmount: 85000,
    advanceAmount: 0,
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    status: 'pending',
    createdAt: format(today, 'yyyy-MM-dd'),
    updatedAt: format(today, 'yyyy-MM-dd'),
  },
  {
    id: 'book-005',
    customerName: 'Ruwan Senanayake',
    customerEmail: 'ruwan.s@example.com',
    customerPhone: '+94 71 888 2233',
    date: format(subDays(today, 7), 'yyyy-MM-dd'),
    timeSlot: '18:00 - 22:00',
    eventType: 'Wedding Reception',
    guestCount: 250,
    totalAmount: 500000,
    advanceAmount: 500000,
    paymentStatus: 'full',
    paymentMethod: 'card',
    status: 'confirmed',
    notes: 'Event completed successfully',
    createdAt: format(subDays(today, 30), 'yyyy-MM-dd'),
    updatedAt: format(subDays(today, 7), 'yyyy-MM-dd'),
  },
  {
    id: 'book-006',
    customerName: 'Lakshmi Abeywardena',
    customerEmail: 'lakshmi.a@example.com',
    customerPhone: '+94 75 456 7890',
    date: format(addDays(today, 30), 'yyyy-MM-dd'),
    timeSlot: '13:00 - 17:00',
    eventType: 'Baby Shower',
    guestCount: 40,
    totalAmount: 65000,
    advanceAmount: 20000,
    paymentStatus: 'advance',
    paymentMethod: 'bank_transfer',
    status: 'confirmed',
    createdAt: format(subDays(today, 1), 'yyyy-MM-dd'),
    updatedAt: format(subDays(today, 1), 'yyyy-MM-dd'),
  },
];

export const dummyCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Kasun Perera',
    email: 'kasun.perera@example.com',
    phone: '+94 71 123 4567',
    address: 'No. 25, Temple Road, Nugegoda, Sri Lanka',
    bookings: [dummyBookings[0]],
    totalSpent: 450000,
    createdAt: format(subDays(today, 90), 'yyyy-MM-dd'),
  },
  {
    id: 'cust-002',
    name: 'Nimasha Fernando',
    email: 'nimasha.f@example.com',
    phone: '+94 76 987 6543',
    address: 'No. 88, Galle Road, Moratuwa, Sri Lanka',
    bookings: [dummyBookings[1]],
    totalSpent: 120000,
    createdAt: format(subDays(today, 60), 'yyyy-MM-dd'),
  },
];

export const dummyPayments: Payment[] = [
  {
    id: 'pay-001',
    bookingId: 'book-001',
    amount: 150000,
    type: 'advance',
    method: 'card',
    status: 'success',
    transactionId: 'TRX-SL-001',
    paidAt: format(subDays(today, 5), 'yyyy-MM-dd'),
  },
  {
    id: 'pay-002',
    bookingId: 'book-002',
    amount: 120000,
    type: 'full',
    method: 'bank_transfer',
    status: 'success',
    transactionId: 'TRX-SL-002',
    paidAt: format(subDays(today, 10), 'yyyy-MM-dd'),
  },
  {
    id: 'pay-003',
    bookingId: 'book-003',
    amount: 75000,
    type: 'advance',
    method: 'cash',
    status: 'success',
    paidAt: format(subDays(today, 3), 'yyyy-MM-dd'),
  },
];

export const eventTypes = [
  'Wedding Reception',
  'Birthday Party',
  'Anniversary',
  'Corporate Event',
  'Baby Shower',
  'Engagement Party',
  'Graduation Party',
  'Cultural Ceremony',
  'Get-Together',
  'Other'
];

export const hallDetails = {
  name: 'Royal Grand Banquet Hall',
  capacity: 350,
  basePrice: 90000,
  features: [
    'Air Conditioning',
    'Parking Space',
    'Sound System',
    'Lighting Setup',
    'Catering Service',
    'Stage & Decoration',
    'Security',
    'Backup Generator',
  ],
  address: 'No. 120, High Level Road, Maharagama, Sri Lanka',
  phone: '+94 11 345 6789',
  email: 'info@royalgrandhall.lk'
};

export function getDashboardStats(): DashboardStats {
  const bookings = dummyBookings;
  
  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.paymentStatus !== 'pending') {
      return sum + b.advanceAmount;
    }
    return sum;
  }, 0);
  
  const monthlyRevenue = [
    { month: 'Jan', revenue: 1500000 },
    { month: 'Feb', revenue: 1800000 },
    { month: 'Mar', revenue: 2100000 },
    { month: 'Apr', revenue: 1650000 },
    { month: 'May', revenue: 1900000 },
    { month: 'Jun', revenue: 2200000 },
  ];
  
  const bookingsByEventType = [
    { type: 'Wedding', count: 12 },
    { type: 'Birthday', count: 9 },
    { type: 'Corporate', count: 7 },
    { type: 'Anniversary', count: 5 },
    { type: 'Other', count: 6 },
  ];
  
  const revenueByPaymentMethod = [
    { method: 'Card', amount: 3000000 },
    { method: 'Cash', amount: 1200000 },
    { method: 'Bank Transfer', amount: 1900000 },
  ];
  
  return {
    totalRevenue,
    totalBookings: bookings.length,
    upcomingBookings: bookings.filter(b => new Date(b.date) >= today && b.status === 'confirmed').length,
    pendingPayments: bookings.filter(b => b.paymentStatus === 'pending' || b.paymentStatus === 'advance').length,
    monthlyRevenue,
    bookingsByEventType,
    revenueByPaymentMethod,
  };
}
