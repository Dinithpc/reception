import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useBookingStore } from '@/store/bookingStore';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { 
  MagnifyingGlassIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export default function Customers() {
  const { customers, bookings } = useBookingStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const getCustomerBookings = (email: string) => {
    return bookings.filter(b => b.customerEmail === email);
  };
  
  const getCustomerStats = (email: string) => {
    const customerBookings = getCustomerBookings(email);
    const totalSpent = customerBookings
      .filter(b => b.paymentStatus !== 'pending')
      .reduce((sum, b) => sum + b.advanceAmount, 0);
    const totalBookings = customerBookings.length;
    const upcomingBookings = customerBookings.filter(
      b => new Date(b.date) >= new Date() && b.status === 'confirmed'
    ).length;
    
    return { totalSpent, totalBookings, upcomingBookings };
  };
  
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  return (
    <Layout>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <p className="mt-1 text-gray-600">Manage your customer database</p>
          </div>
          <button className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
        
        {/* Search */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Customer Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => {
              const stats = getCustomerStats(customer.email);
              const recentBookings = getCustomerBookings(customer.email)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3);
              
              return (
                <div key={customer.id} className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">Customer since {formatDate(customer.createdAt)}</p>
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="mr-2 h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="mr-2 h-4 w-4" />
                      {customer.phone}
                    </div>
                  </div>
                  
                  <div className="mb-4 grid grid-cols-3 gap-2 border-t border-b py-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-green-600">{stats.upcomingBookings}</p>
                      <p className="text-xs text-gray-500">Upcoming</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-primary-600">
                        {formatCurrency(stats.totalSpent).replace('$', '')}
                      </p>
                      <p className="text-xs text-gray-500">Spent</p>
                    </div>
                  </div>
                  
                  {recentBookings.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-700">Recent Bookings</p>
                      <div className="space-y-1">
                        {recentBookings.map((booking) => (
                          <div key={booking.id} className="text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{formatDate(booking.date)}</span>
                              <span className={`text-xs font-medium ${
                                booking.status === 'confirmed' ? 'text-green-600' :
                                booking.status === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No bookings yet</p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-3 rounded-lg bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">
                {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
