// Mock orders data for admin panel testing
export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  event: {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
  };
  payment_method: 'card' | 'upi' | 'netbanking' | 'wallet';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  selected_date: string;
  selected_time: string;
  total_amount: number;
  notes?: string;
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    customer: {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      address: '123 MG Road, Koramangala',
      city: 'Bangalore',
      pincode: '560034'
    },
    event: {
      id: 'EVT-001',
      title: 'Romantic Anniversary Dinner',
      category: 'Anniversary',
      price: 2999,
      image: '/assets/anniversary-event.jpg'
    },
    payment_method: 'card',
    payment_status: 'completed',
    order_status: 'completed',
    selected_date: '2024-01-20',
    selected_time: '19:00',
    total_amount: 2999,
    notes: 'Special request for rose petals on table'
  },
  {
    id: 'ORD-2024-002',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z',
    customer: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 87654 32109',
      address: '456 Brigade Road, MG Road',
      city: 'Bangalore',
      pincode: '560001'
    },
    event: {
      id: 'EVT-002',
      title: 'Birthday Surprise Party',
      category: 'Birthday',
      price: 1999,
      image: '/assets/birthday-event.jpg'
    },
    payment_method: 'upi',
    payment_status: 'completed',
    order_status: 'in_progress',
    selected_date: '2024-01-18',
    selected_time: '18:30',
    total_amount: 1999,
    notes: 'Surprise party - keep it secret!'
  },
  {
    id: 'ORD-2024-003',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
    customer: {
      firstName: 'Tech',
      lastName: 'Corp',
      email: 'events@techcorp.com',
      phone: '+91 76543 21098',
      address: '789 IT Park, Electronic City',
      city: 'Bangalore',
      pincode: '560100'
    },
    event: {
      id: 'EVT-003',
      title: 'Corporate Team Building',
      category: 'Corporate',
      price: 4999,
      image: '/assets/corporate-event.jpg'
    },
    payment_method: 'netbanking',
    payment_status: 'pending',
    order_status: 'confirmed',
    selected_date: '2024-01-25',
    selected_time: '10:00',
    total_amount: 4999,
    notes: 'Team of 20 people, vegetarian food only'
  },
  {
    id: 'ORD-2024-004',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-01-12T16:45:00Z',
    customer: {
      firstName: 'Anita',
      lastName: 'Singh',
      email: 'anita.singh@email.com',
      phone: '+91 65432 10987',
      address: '321 Indiranagar, 100 Feet Road',
      city: 'Bangalore',
      pincode: '560038'
    },
    event: {
      id: 'EVT-004',
      title: 'Kids Theme Party',
      category: 'Kids',
      price: 1499,
      image: '/assets/kids-event.jpg'
    },
    payment_method: 'wallet',
    payment_status: 'completed',
    order_status: 'completed',
    selected_date: '2024-01-16',
    selected_time: '16:00',
    total_amount: 1499,
    notes: 'Princess theme for 5-year-old girl'
  },
  {
    id: 'ORD-2024-005',
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z',
    customer: {
      firstName: 'Amit',
      lastName: 'Patel',
      email: 'amit.patel@email.com',
      phone: '+91 54321 09876',
      address: '654 Whitefield, ITPL Road',
      city: 'Bangalore',
      pincode: '560066'
    },
    event: {
      id: 'EVT-005',
      title: 'Candlelight Dinner',
      category: 'Candlelight',
      price: 3499,
      image: '/assets/candlelight-event.jpg'
    },
    payment_method: 'card',
    payment_status: 'completed',
    order_status: 'completed',
    selected_date: '2024-01-17',
    selected_time: '20:00',
    total_amount: 3499,
    notes: 'Proposal dinner - extra romantic setup needed'
  },
  {
    id: 'ORD-2024-006',
    created_at: '2024-01-10T13:20:00Z',
    updated_at: '2024-01-10T13:20:00Z',
    customer: {
      firstName: 'Sneha',
      lastName: 'Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 43210 98765',
      address: '987 Jayanagar, 4th Block',
      city: 'Bangalore',
      pincode: '560011'
    },
    event: {
      id: 'EVT-006',
      title: 'Festival Celebration',
      category: 'Festival',
      price: 2499,
      image: '/assets/festival-event.jpg'
    },
    payment_method: 'upi',
    payment_status: 'failed',
    order_status: 'pending',
    selected_date: '2024-01-22',
    selected_time: '19:30',
    total_amount: 2499,
    notes: 'Diwali celebration for family'
  },
  {
    id: 'ORD-2024-007',
    created_at: '2024-01-09T08:45:00Z',
    updated_at: '2024-01-09T08:45:00Z',
    customer: {
      firstName: 'Vikram',
      lastName: 'Joshi',
      email: 'vikram.joshi@email.com',
      phone: '+91 32109 87654',
      address: '147 Malleshwaram, 18th Cross',
      city: 'Bangalore',
      pincode: '560003'
    },
    event: {
      id: 'EVT-007',
      title: 'Anniversary Celebration',
      category: 'Anniversary',
      price: 3999,
      image: '/assets/anniversary-event.jpg'
    },
    payment_method: 'card',
    payment_status: 'completed',
    order_status: 'cancelled',
    selected_date: '2024-01-19',
    selected_time: '18:00',
    total_amount: 3999,
    notes: 'Cancelled due to family emergency'
  }
];

export const getOrders = async (): Promise<{ orders: Order[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { orders: mockOrders };
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockOrders.find(order => order.id === id) || null;
};

export const updateOrderStatus = async (id: string, status: Order['order_status']): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const order = mockOrders.find(order => order.id === id);
  if (order) {
    order.order_status = status;
    order.updated_at = new Date().toISOString();
    return true;
  }
  return false;
};
