import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, ShoppingBag, TrendingUp, Star, Plus, DollarSign, Activity, Clock, ArrowUp, ArrowDown, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '₹2,34,567', 
      icon: DollarSign, 
      change: '+23.5%', 
      changeType: 'positive',
      description: 'vs last month',
      trend: [65, 75, 70, 85, 80, 90, 95]
    },
    { 
      title: 'Total Bookings', 
      value: '1,234', 
      icon: Calendar, 
      change: '+12.3%', 
      changeType: 'positive',
      description: 'vs last month',
      trend: [45, 52, 48, 65, 70, 75, 80]
    },
    { 
      title: 'Active Users', 
      value: '8,456', 
      icon: Users, 
      change: '+8.2%', 
      changeType: 'positive',
      description: 'vs last month',
      trend: [30, 35, 40, 38, 45, 50, 55]
    },
    { 
      title: 'Avg Rating', 
      value: '4.9/5.0', 
      icon: Star, 
      change: '+0.2', 
      changeType: 'positive',
      description: 'Customer satisfaction',
      trend: [4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9]
    },
  ];

  const recentBookings = [
    { 
      id: '#ORD-1234', 
      event: 'Romantic Anniversary Dinner', 
      customer: 'Priya Sharma', 
      date: '2024-01-15',
      time: '7:00 PM', 
      status: 'Completed',
      amount: '₹2,999',
      category: 'Anniversary',
      paymentStatus: 'Paid'
    },
    { 
      id: '#ORD-1235', 
      event: 'Birthday Surprise Party', 
      customer: 'Rajesh Kumar', 
      date: '2024-01-14',
      time: '6:30 PM', 
      status: 'In Progress',
      amount: '₹1,999',
      category: 'Birthday',
      paymentStatus: 'Paid'
    },
    { 
      id: '#ORD-1236', 
      event: 'Corporate Team Building', 
      customer: 'Tech Corp', 
      date: '2024-01-13',
      time: '10:00 AM', 
      status: 'Scheduled',
      amount: '₹4,999',
      category: 'Corporate',
      paymentStatus: 'Pending'
    },
    { 
      id: '#ORD-1237', 
      event: 'Kids Theme Party', 
      customer: 'Anita Singh', 
      date: '2024-01-12',
      time: '4:00 PM', 
      status: 'Completed',
      amount: '₹1,499',
      category: 'Kids',
      paymentStatus: 'Paid'
    },
    { 
      id: '#ORD-1238', 
      event: 'Candlelight Dinner', 
      customer: 'Amit Patel', 
      date: '2024-01-11',
      time: '8:00 PM', 
      status: 'Completed',
      amount: '₹3,499',
      category: 'Candlelight',
      paymentStatus: 'Paid'
    },
  ];

  const topCategories = [
    { name: 'Anniversary', bookings: 345, revenue: '₹8,95,000', growth: '+15%', color: 'from-rose-500 to-pink-600', iconColor: 'text-rose-600' },
    { name: 'Birthday', bookings: 289, revenue: '₹6,72,000', growth: '+12%', color: 'from-purple-500 to-fuchsia-600', iconColor: 'text-purple-600' },
    { name: 'Corporate', bookings: 156, revenue: '₹9,84,000', growth: '+23%', color: 'from-blue-500 to-cyan-600', iconColor: 'text-blue-600' },
    { name: 'Candlelight', bookings: 234, revenue: '₹7,34,000', growth: '+18%', color: 'from-amber-500 to-yellow-600', iconColor: 'text-amber-600' },
    { name: 'Kids', bookings: 198, revenue: '₹4,35,000', growth: '+8%', color: 'from-green-500 to-emerald-600', iconColor: 'text-green-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'Paid' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-orange-50 text-orange-700 border-orange-200';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Anniversary': 'bg-rose-50 text-rose-700 border-rose-200',
      'Birthday': 'bg-purple-50 text-purple-700 border-purple-200',
      'Corporate': 'bg-blue-50 text-blue-700 border-blue-200',
      'Kids': 'bg-green-50 text-green-700 border-green-200',
      'Candlelight': 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your events business.</p>
          </div>
          <Link to="/admin/events">
            <Button className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add New Event
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-2 hover:border-amber-300 hover:shadow-xl transition-all duration-300 group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {stat.title}
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{stat.description}</p>
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Bookings - 2/3 width */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 hover:border-amber-200 transition-all shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 via-white to-pink-50 border-b-2 border-amber-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Bookings</CardTitle>
                      <CardDescription className="text-sm">Latest customer orders</CardDescription>
                    </div>
                  </div>
                  <Link to="/admin/orders">
                    <Button variant="outline" size="sm" className="hover:bg-amber-50 hover:border-amber-300">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {recentBookings.map((booking, index) => (
                    <motion.div 
                      key={booking.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-amber-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{booking.event}</p>
                            <p className="text-sm text-gray-600">{booking.customer}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 ml-13">
                          <Badge className={`text-xs border ${getCategoryColor(booking.category)}`}>
                            {booking.category}
                          </Badge>
                          <Badge className={`text-xs border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </Badge>
                          <Badge className={`text-xs border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs text-gray-500 mb-1">{booking.id}</p>
                        <p className="text-lg font-bold text-gray-900">{booking.amount}</p>
                        <p className="text-xs text-gray-600">{booking.date}</p>
                        <p className="text-xs text-gray-500">{booking.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Top Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-2 hover:border-purple-200 transition-all shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 via-white to-pink-50 border-b-2 border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Top Categories</CardTitle>
                      <CardDescription className="text-xs">Best performing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {topCategories.map((category, index) => (
                      <motion.div 
                        key={category.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                              <Star className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900">{category.name}</p>
                              <p className="text-xs text-gray-500">{category.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-gray-900">{category.revenue}</p>
                            <p className="text-xs text-green-600 font-semibold">{category.growth}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-2 hover:border-blue-200 transition-all shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 border-b-2 border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
                      <CardDescription className="text-xs">Manage your platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Link to="/admin/events">
                      <Button variant="outline" className="w-full justify-start hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all group border-2">
                        <Calendar className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Manage Events</span>
                      </Button>
                    </Link>
                    <Link to="/admin/users">
                      <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all group border-2">
                        <Users className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">Manage Users</span>
                      </Button>
                    </Link>
                    <Link to="/admin/orders">
                      <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all group border-2">
                        <ShoppingBag className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">View Orders</span>
                      </Button>
                    </Link>
                    <Link to="/admin/reports">
                      <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all group border-2">
                        <TrendingUp className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold">View Reports</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;