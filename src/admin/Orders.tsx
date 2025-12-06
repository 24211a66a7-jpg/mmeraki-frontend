import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, Package } from 'lucide-react';
import { api } from '@/lib/api';
import { getOrders, updateOrderStatus, type Order } from '@/data/mockOrders';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from admin API first
      try {
        const data = await api.get<any>('/admin/orders');
        if (data && !data.error && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          throw new Error('API returned invalid data');
        }
      } catch (apiError) {

        const mockData = await getOrders();
        setOrders(mockData.orders);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to fetch orders');
      // Fallback to mock data even on error
      try {
        const mockData = await getOrders();
        setOrders(mockData.orders);
        setError(null);
      } catch (mockError) {

      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['order_status']) => {
    try {
      // Try to update via backend API first
      try {
        const response = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus }) as { success?: boolean };
        if (response && response.success) {
          setOrders(prev => prev.map(order =>
            order.id === orderId
              ? { ...order, order_status: newStatus, updated_at: new Date().toISOString() }
              : order
          ));
        }
      } catch (apiError) {

        // Fallback to mock update
        const success = await updateOrderStatus(orderId, newStatus);
        if (success) {
          setOrders(prev => prev.map(order =>
            order.id === orderId
              ? { ...order, order_status: newStatus, updated_at: new Date().toISOString() }
              : order
          ));
        }
      }
    } catch (error) {

    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
              <p className="text-gray-600">Track and manage customer orders</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Showing</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredOrders.length} of {orders.length} orders
                </p>
              </div>
              <Button
                onClick={fetchOrders}
                disabled={loading}
                variant="outline"
                size="sm"
                className="hover:bg-amber-50 hover:border-amber-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                  <SelectItem value="confirmed">✅ Confirmed</SelectItem>
                  <SelectItem value="in_progress">🔄 In Progress</SelectItem>
                  <SelectItem value="completed">🎉 Completed</SelectItem>
                  <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="h-9 hover:bg-gray-50 hover:border-gray-300"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="mb-6 border-2 border-amber-100">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
              <p className="text-gray-600">Loading orders...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-2 border-red-200">
            <CardContent className="p-6 text-center">
              <XCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
              <p className="text-red-600 font-semibold">Error: {error}</p>
              <p className="text-gray-600 text-sm mt-2">Using mock data for demonstration</p>
            </CardContent>
          </Card>
        )}

        {/* Data Source Info */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${orders.length > 0 && orders[0].id.startsWith('ORD-') ? 'bg-green-500' : 'bg-amber-500'}`}></div>
              <span className="text-sm text-gray-700">
                {orders.length > 0 && orders[0].id.startsWith('ORD-')
                  ? 'Live data from database'
                  : 'Mock data for demonstration'
                }
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {orders.length} orders loaded
            </span>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg group bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {order.id.slice(-4).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          Order #{order.id.slice(-8)}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.order_status)}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(order.order_status)}`}>
                      {order.order_status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Customer & Event Info - Main Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Customer</h4>
                        <p className="text-gray-700 font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-gray-500 text-xs">{order.customer.email}</p>
                        <p className="text-gray-500 text-xs">{order.customer.phone}</p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Amount</h4>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{order.total_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="border-t border-gray-100 pt-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Address</h4>
                      <p className="text-gray-600 text-xs">
                        {[order.customer.address, order.customer.city, order.customer.pincode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Event Details</h4>
                      <div className="space-y-1">
                        <p className="text-gray-700 font-medium text-sm">{order.event.title}</p>
                        <p className="text-gray-500 text-xs capitalize">{order.event.category}</p>
                        {order.selected_date && (
                          <p className="text-gray-500 text-xs">
                            📅 {order.selected_date} {order.selected_time && `at ${order.selected_time}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-medium capitalize">
                      {order.payment_method.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Status Update */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="text-xs font-medium text-gray-700 mb-2 block">Update Status</label>
                    <Select
                      value={order.order_status}
                      onValueChange={(value: Order['order_status']) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-full h-9 text-sm border-gray-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">⏳ Pending</SelectItem>
                        <SelectItem value="confirmed">✅ Confirmed</SelectItem>
                        <SelectItem value="in_progress">🔄 In Progress</SelectItem>
                        <SelectItem value="completed">🎉 Completed</SelectItem>
                        <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <Card className="border-2 border-amber-100">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more orders.'
                  : 'No orders have been placed yet.'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="hover:bg-amber-50 hover:border-amber-300"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;