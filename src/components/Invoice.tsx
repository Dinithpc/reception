import React, { forwardRef } from 'react';
import { Booking } from '@/types';
import { formatDate, formatCurrency, generateInvoiceNumber } from '@/utils/helpers';
import { hallDetails } from '@/data/dummy';

interface InvoiceProps {
  booking: Booking;
  payments: any[];
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(({ booking, payments }, ref) => {
  const invoiceNumber = generateInvoiceNumber();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = booking.totalAmount - totalPaid;
  const tax = booking.totalAmount * 0.1; // 10% tax
  const subtotal = booking.totalAmount - tax;
  
  return (
    <div ref={ref} className="bg-white p-8" style={{ width: '210mm', minHeight: '297mm' }}>
      {/* Header */}
      <div className="mb-8 border-b-2 border-gray-300 pb-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">{hallDetails.name}</h1>
            <p className="mt-2 text-gray-600">{hallDetails.address}</p>
            <p className="text-gray-600">Phone: {hallDetails.phone}</p>
            <p className="text-gray-600">Email: {hallDetails.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <p className="mt-2 text-gray-600">Invoice #: {invoiceNumber}</p>
            <p className="text-gray-600">Date: {formatDate(new Date())}</p>
          </div>
        </div>
      </div>
      
      {/* Customer Details */}
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-3 font-semibold text-gray-700">Bill To:</h3>
          <p className="font-semibold">{booking.customerName}</p>
          <p className="text-gray-600">{booking.customerEmail}</p>
          <p className="text-gray-600">{booking.customerPhone}</p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-gray-700">Event Details:</h3>
          <p className="text-gray-600">Event Type: {booking.eventType}</p>
          <p className="text-gray-600">Event Date: {formatDate(booking.date)}</p>
          <p className="text-gray-600">Time Slot: {booking.timeSlot}</p>
          <p className="text-gray-600">Guest Count: {booking.guestCount}</p>
        </div>
      </div>
      
      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="pb-3 text-left font-semibold">Description</th>
              <th className="pb-3 text-right font-semibold">Quantity</th>
              <th className="pb-3 text-right font-semibold">Rate</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3">Hall Rental - {booking.timeSlot}</td>
              <td className="py-3 text-right">1</td>
              <td className="py-3 text-right">{formatCurrency(subtotal)}</td>
              <td className="py-3 text-right">{formatCurrency(subtotal)}</td>
            </tr>
            {booking.notes && (
              <tr className="border-b border-gray-200">
                <td className="py-3 text-sm text-gray-600" colSpan={4}>
                  Special Requirements: {booking.notes}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-80">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax (10%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-gray-300 py-2 text-lg font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(booking.totalAmount)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Amount Paid:</span>
            <span className="text-green-600">{formatCurrency(totalPaid)}</span>
          </div>
          {balance > 0 && (
            <div className="flex justify-between border-t border-gray-300 py-2 font-semibold">
              <span>Balance Due:</span>
              <span className="text-red-600">{formatCurrency(balance)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment History */}
      {payments.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 font-semibold">Payment History:</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left">Date</th>
                <th className="pb-2 text-left">Method</th>
                <th className="pb-2 text-left">Transaction ID</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{formatDate(payment.paidAt)}</td>
                  <td className="py-2 capitalize">{payment.method.replace('_', ' ')}</td>
                  <td className="py-2">{payment.transactionId || '-'}</td>
                  <td className="py-2 text-right">{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-16 border-t border-gray-300 pt-8 text-center text-sm text-gray-600">
        <p>Thank you for choosing {hallDetails.name}!</p>
        <p>For any queries, please contact us at {hallDetails.phone} or {hallDetails.email}</p>
      </div>
    </div>
  );
});

Invoice.displayName = 'Invoice';

export default Invoice;
