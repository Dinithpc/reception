import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Invoice from '@/components/Invoice';
import { useBookingStore } from '@/store/bookingStore';
import { formatDate, formatCurrency, sendEmail, sendSMS, getPaymentReminderMessage } from '@/utils/helpers';
import ReactToPrint from 'react-to-print';
import toast, { Toaster } from 'react-hot-toast';
import { 
  PrinterIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  PencilIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function BookingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const { getBooking, getPaymentsByBooking, updateBooking } = useBookingStore();
  
  const booking = id ? getBooking(id as string) : undefined;
  const payments = id ? getPaymentsByBooking(id as string) : [];
  
  if (!booking) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Booking not found</p>
            <Link href="/bookings" className="mt-2 text-primary-600 hover:underline">
              Back to Bookings
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  const balance = booking.totalAmount - booking.advanceAmount;
  
  const handleSendEmail = async () => {
    try {
      const message = `
        Dear ${booking.customerName},
        
        Here are your booking details:
        Event: ${booking.eventType}
        Date: ${formatDate(booking.date)}
        Time: ${booking.timeSlot}
        Total Amount: ${formatCurrency(booking.totalAmount)}
        Paid: ${formatCurrency(booking.advanceAmount)}
        Balance: ${formatCurrency(balance)}
        
        Thank you for choosing Grand Reception Hall!
      `;
      
      await sendEmail(booking.customerEmail, 'Booking Details', message);
      toast.success('Email sent successfully');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };
  
  const handleSendSMS = async () => {
    try {
      const message = balance > 0 
        ? getPaymentReminderMessage(booking)
        : `Your booking for ${formatDate(booking.date)} is confirmed. Total: ${formatCurrency(booking.totalAmount)}`;
      
      await sendSMS(booking.customerPhone, message);
      toast.success('SMS sent successfully');
    } catch (error) {
      toast.error('Failed to send SMS');
    }
  };
  
  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBooking(booking.id, { status: 'cancelled' });
      toast.success('Booking cancelled');
    }
  };
  
  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/bookings"
              className="mr-4 rounded-lg p-2 hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Booking Details</h1>
              <p className="mt-1 text-gray-600">ID: {booking.id}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ReactToPrint
              trigger={() => (
                <button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  <PrinterIcon className="mr-2 h-4 w-4" />
                  Print Invoice
                </button>
              )}
              content={() => invoiceRef.current}
            />
            
            <button
              onClick={handleSendEmail}
              className="flex items-center rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              <EnvelopeIcon className="mr-2 h-4 w-4" />
              Send Email
            </button>
            
            <button
              onClick={handleSendSMS}
              className="flex items-center rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
            >
              <PhoneIcon className="mr-2 h-4 w-4" />
              Send SMS
            </button>
            
            <Link
              href={`/bookings/${booking.id}/edit`}
              className="flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{booking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-medium">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Event Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="font-medium">{booking.eventType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event Date</p>
                  <p className="font-medium">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-medium">{booking.timeSlot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guest Count</p>
                  <p className="font-medium">{booking.guestCount}</p>
                </div>
                {booking.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Special Requirements</p>
                    <p className="font-medium">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Summary */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(booking.advanceAmount)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Balance Due</span>
                    <span className={`font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </div>
              </div>
              
              {balance > 0 && (
                <Link
                  href={`/payments/new?bookingId=${booking.id}`}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <CurrencyDollarIcon className="mr-2 h-4 w-4" />
                  Record Payment
                </Link>
              )}
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Booking Status</p>
                  <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    booking.paymentStatus === 'full' 
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'advance'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.paymentStatus === 'full' ? 'Fully Paid' : 
                     booking.paymentStatus === 'advance' ? 'Advance Paid' : 'Pending'}
                  </span>
                </div>
              </div>
              
              {booking.status !== 'cancelled' && (
                <button
                  onClick={handleCancelBooking}
                  className="mt-4 w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Hidden Invoice for Printing */}
        <div style={{ display: 'none' }}>
          <Invoice ref={invoiceRef} booking={booking} payments={payments} />
        </div>
      </div>
    </Layout>
  );
}
