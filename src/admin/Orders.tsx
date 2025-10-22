import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface OrderItem {
  id: string;
  created_at?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    pincode?: string;
  };
  payment_method?: string;
  selected_date?: string;
  selected_time?: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<any>('/orders');
      if (!data || data.error) throw new Error(data?.message || 'Failed to fetch orders');
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Orders</h1>
        <Badge variant="secondary" className="text-sm">{orders.length} orders</Badge>
      </div>

      {loading && (
        <Card className="mb-6"><CardContent className="p-6">Loading orders...</CardContent></Card>
      )}
      {error && (
        <Card className="mb-6 border-red-200"><CardContent className="p-6 text-red-600">{error}</CardContent></Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((o) => (
          <Card key={o.id} className="border-2 border-amber-100 hover:border-amber-300 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900 flex items-center justify-between">
                <span>Order #{o.id.slice(0, 8)}</span>
                <Badge className="bg-emerald-100 text-emerald-700">Confirmed</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium truncate max-w-[60%]">
                  {o.customer?.firstName} {o.customer?.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{o.customer?.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium uppercase">{o.payment_method || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Event</span>
                <span className="font-medium">{o.selected_date || '-'} {o.selected_time || ''}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;