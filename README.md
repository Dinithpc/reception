# Reception Hall Booking System

A comprehensive booking management system for reception halls built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- **Customer Booking Management**: Create, edit, and manage bookings
- **Calendar View**: Visual calendar showing all bookings
- **Time Slot Management**: Morning, afternoon, and evening slots with different pricing
- **Payment Tracking**: Handle advance payments and full payments
- **Invoice Generation**: Print professional invoices for customers
- **Email & SMS Notifications**: Send booking confirmations and payment reminders
- **Dashboard Analytics**: View monthly revenue, booking statistics, and performance metrics

### Key Features
- Real-time availability checking
- Customer database management
- Payment status tracking (pending/advance/full)
- Booking status management (confirmed/pending/cancelled)
- Dynamic pricing based on time slots and guest count
- Comprehensive reporting and analytics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Date Handling**: date-fns
- **Calendar**: react-calendar
- **Charts**: Recharts
- **PDF Generation**: react-to-print
- **Notifications**: react-hot-toast

## Installation

1. Clone the repository
2. Navigate to the project directory:
```bash
cd reception-hall-booking
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
reception-hall-booking/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx     # Main layout with sidebar
│   │   └── Invoice.tsx    # Invoice component for printing
│   ├── data/
│   │   └── dummy.ts       # Dummy data for testing
│   ├── pages/             # Next.js pages
│   │   ├── index.tsx      # Dashboard
│   │   ├── bookings/      # Booking pages
│   │   ├── calendar.tsx   # Calendar view
│   │   ├── customers.tsx  # Customer management
│   │   └── ...
│   ├── store/
│   │   └── bookingStore.ts # Zustand state management
│   ├── styles/
│   │   └── globals.css    # Global styles
│   ├── types/
│   │   └── index.ts       # TypeScript type definitions
│   └── utils/
│       └── helpers.ts     # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Usage

### Creating a Booking
1. Navigate to "New Booking" from the sidebar
2. Fill in customer information
3. Select date and time slot
4. Enter event details and guest count
5. Process payment (advance or full)
6. System automatically sends confirmation email/SMS

### Managing Bookings
- View all bookings in the "All Bookings" page
- Filter by status, payment status, or search by customer
- Click on any booking to view details
- Print invoice from booking details page
- Edit or cancel bookings as needed

### Calendar View
- Visual representation of all bookings
- Click on any date to see bookings for that day
- Quick statistics for the selected month
- Add new bookings directly from calendar

### Dashboard
- Overview of total revenue and bookings
- Upcoming events counter
- Pending payments tracker
- Monthly revenue chart
- Bookings by event type
- Revenue by payment method

## Features in Detail

### Payment Processing
- Supports cash, card, and bank transfer
- Track advance payments and balances
- Automatic payment status updates
- Payment history tracking

### Communication
- Automated booking confirmation emails
- SMS notifications for customers
- Payment reminder messages
- Invoice email delivery

### Reporting
- Monthly revenue reports
- Booking analytics
- Customer spending analysis
- Payment method breakdown

## Default Login
The system doesn't require authentication in this demo version. Simply run the application to access all features.

## Future Enhancements
- User authentication and roles
- Online payment gateway integration
- Real SMS/Email service integration
- Advanced reporting features
- Multi-hall support
- Staff management
- Catering integration
- Equipment rental tracking

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
