import { create } from 'zustand';
import { Booking, Customer, Payment } from '@/types';
import { dummyBookings, dummyCustomers, dummyPayments } from '@/data/dummy';

interface BookingStore {
  bookings: Booking[];
  customers: Customer[];
  payments: Payment[];
  
  // Booking actions
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  getBookingsByDate: (date: string) => Booking[];
  
  // Payment actions
  addPayment: (payment: Payment) => void;
  getPaymentsByBooking: (bookingId: string) => Payment[];
  
  // Customer actions
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  getCustomer: (email: string) => Customer | undefined;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: dummyBookings,
  customers: dummyCustomers,
  payments: dummyPayments,
  
  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, booking]
  })),
  
  updateBooking: (id, updatedBooking) => set((state) => ({
    bookings: state.bookings.map(b => 
      b.id === id ? { ...b, ...updatedBooking, updatedAt: new Date().toISOString() } : b
    )
  })),
  
  deleteBooking: (id) => set((state) => ({
    bookings: state.bookings.filter(b => b.id !== id)
  })),
  
  getBooking: (id) => {
    return get().bookings.find(b => b.id === id);
  },
  
  getBookingsByDate: (date) => {
    return get().bookings.filter(b => b.date === date);
  },
  
  addPayment: (payment) => set((state) => {
    // Update booking payment status
    const booking = state.bookings.find(b => b.id === payment.bookingId);
    if (booking) {
      const totalPaid = state.payments
        .filter(p => p.bookingId === payment.bookingId && p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0) + payment.amount;
      
      const paymentStatus = totalPaid >= booking.totalAmount ? 'full' : 'advance';
      
      return {
        payments: [...state.payments, payment],
        bookings: state.bookings.map(b => 
          b.id === payment.bookingId 
            ? { ...b, paymentStatus, advanceAmount: totalPaid }
            : b
        )
      };
    }
    return {
      payments: [...state.payments, payment]
    };
  }),
  
  getPaymentsByBooking: (bookingId) => {
    return get().payments.filter(p => p.bookingId === bookingId);
  },
  
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, customer]
  })),
  
  updateCustomer: (id, updatedCustomer) => set((state) => ({
    customers: state.customers.map(c => 
      c.id === id ? { ...c, ...updatedCustomer } : c
    )
  })),
  
  getCustomer: (email) => {
    return get().customers.find(c => c.email === email);
  },
}));
