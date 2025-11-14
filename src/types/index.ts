export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  eventType: string;
  guestCount: number;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: 'pending' | 'advance' | 'full';
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  basePrice: number;
  features: string[];
  images: string[];
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  type: 'advance' | 'full' | 'balance';
  method: 'cash' | 'card' | 'bank_transfer';
  status: 'success' | 'pending' | 'failed';
  transactionId?: string;
  paidAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  bookings: Booking[];
  totalSpent: number;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  upcomingBookings: number;
  pendingPayments: number;
  monthlyRevenue: { month: string; revenue: number }[];
  bookingsByEventType: { type: string; count: number }[];
  revenueByPaymentMethod: { method: string; amount: number }[];
}

export interface Invoice {
  id: string;
  bookingId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
