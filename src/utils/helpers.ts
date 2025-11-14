import { format, parseISO, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// -------------------------
// FORMATTING HELPERS
// -------------------------
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayHours}:${minutes} ${ampm}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function calculateBalance(totalAmount: number, paidAmount: number): number {
  return totalAmount - paidAmount;
}

export function getMonthDays(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function isTimeSlotAvailable(date: string, timeSlot: string, bookings: any[]): boolean {
  return !bookings.some(
    booking => booking.date === date && booking.timeSlot === timeSlot && booking.status !== 'cancelled'
  );
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// -------------------------
// TIME SLOTS
// -------------------------
export function generateTimeSlots() {
  const slots = [];
  const startHour = 9;
  const endHour = 22;

  for (let hour = startHour; hour < endHour; hour += 4) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 4).toString().padStart(2, '0')}:00`;
    slots.push({
      id: `slot-${hour}`,
      startTime,
      endTime,
      display: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      price: hour >= 18 ? 1500 : 1000,
    });
  }

  return slots;
}

// -------------------------
// SMS MOCK
// -------------------------
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  console.log(`SMS sent to ${phone}: ${message}`);
  return true;
}

// -------------------------
// EMAIL CLIENT CALL
// -------------------------
export async function sendEmail(email: string, subject: string, body: string): Promise<boolean> {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, subject, body })
  });

  return response.ok;
}

// -------------------------
// BOOKING MESSAGES
// -------------------------
export function getBookingConfirmationMessage(booking: any): string {
  return `Dear ${booking.customerName}, your booking at Grand Reception Hall on ${formatDate(booking.date)} from ${booking.timeSlot} has been confirmed. Total amount: ${formatCurrency(booking.totalAmount)}. Thank you!`;
}

export function getPaymentReminderMessage(booking: any): string {
  const balance = calculateBalance(booking.totalAmount, booking.advanceAmount);
  return `Reminder: You have a pending balance of ${formatCurrency(balance)} for your booking on ${formatDate(booking.date)}. Please complete the payment before the event date.`;
}
