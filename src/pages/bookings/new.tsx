import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useBookingStore } from '@/store/bookingStore';
import { eventTypes } from '@/data/dummy';
import { 
  validateEmail, 
  validatePhone, 
  generateTimeSlots, 
  sendEmail, 
  sendSMS,
  getBookingConfirmationMessage,
  formatCurrency
} from '@/utils/helpers';
import toast, { Toaster } from 'react-hot-toast';
import { Booking, Customer } from '@/types';

export default function NewBooking() {
  const router = useRouter();
  const { addBooking, addCustomer, getCustomer, getBookingsByDate } = useBookingStore();
  const timeSlots = generateTimeSlots();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    timeSlot: '',
    eventType: '',
    guestCount: '',
    totalAmount: 1000,
    advanceAmount: 0,
    paymentMethod: 'cash',
    notes: '',
  });
  
  const [errors, setErrors] = useState<any>({});
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (formData.date) {
      const bookings = getBookingsByDate(formData.date);
      const bookedSlots = bookings.map(b => b.timeSlot);
      setAvailableSlots(
        timeSlots.map(slot => ({
          ...slot,
          available: !bookedSlots.includes(slot.display)
        }))
      );
    }
  }, [formData.date]);
  
  useEffect(() => {
    // Calculate price based on time slot and guest count
    const selectedSlot = timeSlots.find(s => s.display === formData.timeSlot);
    if (selectedSlot) {
      const basePrice = selectedSlot.price;
      const guestPrice = parseInt(formData.guestCount || '0') * 5;
      setFormData(prev => ({ ...prev, totalAmount: basePrice + guestPrice }));
    }
  }, [formData.timeSlot, formData.guestCount]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
    } else if (!validatePhone(formData.customerPhone)) {
      newErrors.customerPhone = 'Invalid phone number';
    }
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    if (!formData.guestCount || parseInt(formData.guestCount) < 1) {
      newErrors.guestCount = 'Guest count must be at least 1';
    }
    
    if (formData.advanceAmount > formData.totalAmount) {
      newErrors.advanceAmount = 'Advance cannot exceed total amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if customer exists, if not create new
      let customer = getCustomer(formData.customerEmail);
      if (!customer) {
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          bookings: [],
          totalSpent: 0,
          createdAt: new Date().toISOString(),
        };
        addCustomer(newCustomer);
        customer = newCustomer;
      }
      
      // Create booking
      const booking: Booking = {
        id: `book-${Date.now()}`,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        date: formData.date,
        timeSlot: formData.timeSlot,
        eventType: formData.eventType,
        guestCount: parseInt(formData.guestCount),
        totalAmount: formData.totalAmount,
        advanceAmount: formData.advanceAmount,
        paymentStatus: formData.advanceAmount === 0 ? 'pending' : 
                       formData.advanceAmount >= formData.totalAmount ? 'full' : 'advance',
        paymentMethod: formData.paymentMethod as any,
        status: formData.advanceAmount > 0 ? 'confirmed' : 'pending',
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addBooking(booking);
      
      // Send confirmation email and SMS
      const message = getBookingConfirmationMessage(booking);
      await sendEmail(booking.customerEmail, 'Booking Confirmation', message);
      await sendSMS(booking.customerPhone, message);
      
      toast.success('Booking created successfully!');
      
      // Redirect to booking details
      setTimeout(() => {
        router.push(`/bookings/${booking.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create New Booking</h1>
          <p className="mt-1 text-gray-600">Fill in the details to create a new hall booking</p>
        </div>
        
        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-8 shadow-sm">
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Customer Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
                )}
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.customerEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>
                )}
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+1 555-0123"
                />
                {errors.customerPhone && (
                  <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Event Details */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Event Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                )}
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Time Slot *
                </label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.timeSlot ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select time slot</option>
                  {availableSlots.map((slot) => (
                    <option 
                      key={slot.id} 
                      value={slot.display}
                      disabled={slot.available === false}
                    >
                      {slot.display} - {formatCurrency(slot.price)}
                      {slot.available === false && ' (Booked)'}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-red-500">{errors.timeSlot}</p>
                )}
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.eventType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="mt-1 text-sm text-red-500">{errors.eventType}</p>
                )}
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.guestCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50"
                />
                {errors.guestCount && (
                  <p className="mt-1 text-sm text-red-500">{errors.guestCount}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Special Requirements / Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                placeholder="Any special requirements..."
              />
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Payment Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.totalAmount)}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Advance Payment
                </label>
                <input
                  type="number"
                  name="advanceAmount"
                  value={formData.advanceAmount}
                  onChange={handleChange}
                  min="0"
                  max={formData.totalAmount}
                  className={`w-full rounded-lg border px-4 py-2 focus:border-primary-500 focus:outline-none ${
                    errors.advanceAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.advanceAmount && (
                  <p className="mt-1 text-sm text-red-500">{errors.advanceAmount}</p>
                )}
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Balance Amount
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.totalAmount - formData.advanceAmount)}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/bookings')}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
