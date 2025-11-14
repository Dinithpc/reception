import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useBookingStore } from '@/store/bookingStore';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function Bookings() {
  const { bookings, deleteBooking } = useBookingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || booking.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete booking for ${name}?`)) {
      deleteBooking(id);
      toast.success('Booking deleted successfully');
    }
  };
  
  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const getPaymentBadge = (status: string) => {
    const styles = {
      full: 'bg-green-100 text-green-800',
      advance: 'bg-blue-100 text-blue-800',
      pending: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status === 'full' ? 'Paid Full' : status === 'advance' ? 'Advance Paid' : 'Pending'}
      </span>
    );
  };
  
  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Bookings</h1>
            <p className="mt-1 text-gray-600">Manage and view all hall bookings</p>
          </div>
          <Link
            href="/bookings/new"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            New Booking
          </Link>
        </div>
        
        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <label className="mr-2 text-sm text-gray-600">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="mr-2 text-sm text-gray-600">Payment:</label>
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="full">Full Paid</option>
                  <option value="advance">Advance Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bookings Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Event Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                          <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                          <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {booking.eventType}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                          {booking.advanceAmount > 0 && booking.advanceAmount < booking.totalAmount && (
                            <div className="text-sm text-gray-500">
                              Paid: {formatCurrency(booking.advanceAmount)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getPaymentBadge(booking.paymentStatus)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/bookings/${booking.id}`}
                            className="text-primary-600 hover:text-primary-900"
                            title="View"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/bookings/${booking.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(booking.id, booking.customerName)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No bookings found</p>
                        <p className="mt-1 text-sm">
                          {searchTerm || filterStatus !== 'all' || filterPayment !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Create your first booking to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
