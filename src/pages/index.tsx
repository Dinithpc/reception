import React from 'react';
import Layout from '@/components/Layout';
import { getDashboardStats } from '@/data/dummy';
import { formatCurrency } from '@/utils/helpers';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'];

export default function Dashboard() {
  const stats = getDashboardStats();
  
  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: CurrencyDollarIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarDaysIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingBookings,
      icon: ClockIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  ];
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to Grand Reception Hall</h1>
          <p className="mt-1 text-gray-600">Here's an overview of your business performance</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center">
                  <div className={`rounded-lg ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Monthly Revenue Chart */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Bookings by Event Type */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Bookings by Event Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.bookingsByEventType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Revenue by Payment Method */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Revenue by Payment Method</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.revenueByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.method}: ${formatCurrency(entry.amount)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {stats.revenueByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Recent Bookings Table */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left">Customer</th>
                    <th className="pb-2 text-left">Date</th>
                    <th className="pb-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.totalBookings > 0 ? (
                    <tr className="border-b">
                      <td className="py-2">John Smith</td>
                      <td className="py-2">Dec 15, 2024</td>
                      <td className="py-2">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                          Confirmed
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
                        No recent bookings
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
