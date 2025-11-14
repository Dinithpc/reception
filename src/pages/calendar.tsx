import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useBookingStore } from '@/store/bookingStore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/helpers';

export default function CalendarView() {
  const { bookings } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(b => b.date === dateStr && b.status !== 'cancelled');
  };
  
  const selectedDateBookings = selectedDate 
    ? getBookingsForDate(selectedDate)
    : [];
  
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayBookings = getBookingsForDate(date);
      if (dayBookings.length > 0) {
        return (
          <div className="mt-1">
            <div className="mx-auto h-2 w-2 rounded-full bg-primary-600"></div>
            <p className="text-xs">{dayBookings.length}</p>
          </div>
        );
      }
    }
    return null;
  };
  
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayBookings = getBookingsForDate(date);
      if (dayBookings.length > 0) {
        return 'has-bookings';
      }
    }
    return '';
  };
  
  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <Layout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Calendar View</h1>
          <p className="mt-1 text-gray-600">View bookings in calendar format</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedDate && format(selectedDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                  >
                    Today
                  </button>
                </div>
              </div>
              
              <style jsx global>{`
                .react-calendar {
                  width: 100%;
                  border: none;
                  font-family: inherit;
                  background: white;
                }
                
                .react-calendar__tile {
                  height: 80px;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: center;
                  padding: 10px 5px;
                  position: relative;
                }
                
                .react-calendar__tile--active {
                  background: #0ea5e9;
                  color: white;
                }
                
                .react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus {
                  background: #0284c7;
                }
                
                .react-calendar__tile--hasActive {
                  background: #e0f2fe;
                }
                
                .react-calendar__tile.has-bookings {
                  background: #f0f9ff;
                }
                
                .react-calendar__tile.has-bookings:hover {
                  background: #e0f2fe;
                }
                
                .react-calendar__month-view__days__day--weekend {
                  color: #0369a1;
                }
                
                .react-calendar__navigation button {
                  font-size: 1.1em;
                  padding: 10px;
                }
              `}</style>
              
              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                minDetail="month"
                maxDetail="month"
                navigationLabel={({ label }) => label}
              />
            </div>
          </div>
          
          {/* Selected Date Bookings */}
          <div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                </h2>
                <Link
                  href={`/bookings/new?date=${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}`}
                  className="rounded-lg bg-primary-600 px-3 py-1 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Add Booking
                </Link>
              </div>
              
              {selectedDateBookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{booking.customerName}</p>
                          <p className="text-sm text-gray-500">{booking.eventType}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">{booking.timeSlot}</p>
                        <p className="text-gray-600">Guests: {booking.guestCount}</p>
                        <p className="font-medium text-gray-900">{formatCurrency(booking.totalAmount)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No bookings for this date</p>
                  <Link
                    href={`/bookings/new?date=${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}`}
                    className="mt-2 inline-block text-primary-600 hover:underline"
                  >
                    Create a booking
                  </Link>
                </div>
              )}
            </div>
            
            {/* Statistics */}
            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Month Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-medium">
                    {bookings.filter(b => {
                      const bookingMonth = new Date(b.date).getMonth();
                      const selectedMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
                      return bookingMonth === selectedMonth && b.status !== 'cancelled';
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-medium text-green-600">
                    {bookings.filter(b => {
                      const bookingMonth = new Date(b.date).getMonth();
                      const selectedMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
                      return bookingMonth === selectedMonth && b.status === 'confirmed';
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600">
                    {bookings.filter(b => {
                      const bookingMonth = new Date(b.date).getMonth();
                      const selectedMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
                      return bookingMonth === selectedMonth && b.status === 'pending';
                    }).length}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Revenue</span>
                    <span className="font-semibold text-primary-600">
                      {formatCurrency(
                        bookings
                          .filter(b => {
                            const bookingMonth = new Date(b.date).getMonth();
                            const selectedMonth = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
                            return bookingMonth === selectedMonth && b.status === 'confirmed';
                          })
                          .reduce((sum, b) => sum + b.totalAmount, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
