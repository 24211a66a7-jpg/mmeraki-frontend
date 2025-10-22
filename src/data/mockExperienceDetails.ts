// Comprehensive mock data for experience details page
export interface MockAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'photography' | 'entertainment' | 'catering' | 'transport' | 'beauty' | 'decoration';
  popular?: boolean;
}

export interface MockReview {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

export interface MockSimilarProduct {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  slug: string;
  featured?: boolean;
}

export interface MockCancellationPolicy {
  id: string;
  title: string;
  description: string;
  refundPercentage: number;
  timeLimit: string;
  color: 'green' | 'yellow' | 'red';
}

// Mock Add-ons Data
export const mockAddons: MockAddon[] = [
  {
    id: 'photography',
    name: 'Professional Photography',
    price: 1500,
    description: '2 hours of professional photography with edited photos',
    category: 'photography',
    popular: true
  },
  {
    id: 'videography',
    name: 'Videography Package',
    price: 2500,
    description: 'Complete video coverage with cinematic highlights',
    category: 'photography',
    popular: true
  },
  {
    id: 'music',
    name: 'Live Music Setup',
    price: 2000,
    description: 'DJ or live musician for entertainment',
    category: 'entertainment',
    popular: false
  },
  {
    id: 'catering',
    name: 'Premium Catering',
    price: 3000,
    description: 'Gourmet food and beverages for all guests',
    category: 'catering',
    popular: true
  },
  {
    id: 'transport',
    name: 'Transportation',
    price: 1000,
    description: 'Pickup and drop service for guests',
    category: 'transport',
    popular: false
  },
  {
    id: 'makeup',
    name: 'Makeup Artist',
    price: 2000,
    description: 'Professional makeup and styling for the occasion',
    category: 'beauty',
    popular: false
  },
  {
    id: 'decoration',
    name: 'Extra Decoration',
    price: 1200,
    description: 'Additional themed decorations and props',
    category: 'decoration',
    popular: false
  },
  {
    id: 'cake',
    name: 'Custom Cake',
    price: 1800,
    description: 'Personalized cake with custom design',
    category: 'catering',
    popular: true
  }
];

// Mock Reviews Data
export const mockReviews: MockReview[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely amazing experience! The team was professional and everything was perfect. The romantic setup exceeded our expectations. Highly recommend!',
    verified: true,
    helpful: 12,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great service and beautiful setup. The decoration was exactly as promised. The team was punctual and professional. Will definitely book again.',
    verified: true,
    helpful: 8
  },
  {
    id: 3,
    name: 'Anita Singh',
    rating: 5,
    date: '2024-01-05',
    comment: 'Perfect for our anniversary celebration. The romantic setup was breathtaking and created the most magical evening. Thank you for making our day special!',
    verified: false,
    helpful: 15
  },
  {
    id: 4,
    name: 'Vikram Patel',
    rating: 5,
    date: '2024-01-01',
    comment: 'Excellent service from start to finish. The team was very responsive and accommodating. The final result was beyond our expectations. Worth every penny!',
    verified: true,
    helpful: 20
  },
  {
    id: 5,
    name: 'Sneha Reddy',
    rating: 4,
    date: '2023-12-28',
    comment: 'Good experience overall. The setup was beautiful and the team was professional. Minor delay in setup but they compensated well. Would recommend.',
    verified: true,
    helpful: 6
  },
  {
    id: 6,
    name: 'Arjun Mehta',
    rating: 5,
    date: '2023-12-20',
    comment: 'Outstanding service! The attention to detail was incredible. Every element was perfectly placed and the overall ambiance was magical. Highly recommended!',
    verified: true,
    helpful: 18
  }
];

// Mock Similar Products Data
export const mockSimilarProducts: MockSimilarProduct[] = [
  {
    id: '1',
    title: 'Luxury Candlelight Dinner',
    price: '₹4,999',
    originalPrice: '₹6,999',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
    rating: 4.8,
    reviews: 45,
    category: 'anniversary',
    slug: 'luxury-candlelight-dinner',
    featured: true
  },
  {
    id: '2',
    title: 'Rooftop Dining Experience',
    price: '₹3,999',
    image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=300&h=200&fit=crop',
    rating: 4.6,
    reviews: 32,
    category: 'anniversary',
    slug: 'rooftop-dining-experience'
  },
  {
    id: '3',
    title: 'Private Movie Night',
    price: '₹2,999',
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=300&h=200&fit=crop',
    rating: 4.7,
    reviews: 28,
    category: 'anniversary',
    slug: 'private-movie-night'
  },
  {
    id: '4',
    title: 'Poolside Candlelight Dinner',
    price: '₹5,499',
    originalPrice: '₹7,499',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
    rating: 4.9,
    reviews: 67,
    category: 'anniversary',
    slug: 'poolside-candlelight-dinner',
    featured: true
  },
  {
    id: '5',
    title: 'Garden Party Setup',
    price: '₹3,499',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=200&fit=crop',
    rating: 4.5,
    reviews: 23,
    category: 'birthday',
    slug: 'garden-party-setup'
  },
  {
    id: '6',
    title: 'Indoor Picnic Experience',
    price: '₹2,499',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop',
    rating: 4.4,
    reviews: 19,
    category: 'anniversary',
    slug: 'indoor-picnic-experience'
  }
];

// Mock Cancellation Policies
export const mockCancellationPolicies: MockCancellationPolicy[] = [
  {
    id: 'free',
    title: 'Free Cancellation',
    description: 'Cancel up to 48 hours before your experience for a full refund',
    refundPercentage: 100,
    timeLimit: '48 hours',
    color: 'green'
  },
  {
    id: 'partial',
    title: 'Partial Refund',
    description: 'Cancel between 24-48 hours before for 50% refund',
    refundPercentage: 50,
    timeLimit: '24-48 hours',
    color: 'yellow'
  },
  {
    id: 'no-refund',
    title: 'No Refund',
    description: 'Cancel less than 24 hours before - no refund available',
    refundPercentage: 0,
    timeLimit: 'Less than 24 hours',
    color: 'red'
  }
];

// Mock Time Slots
export const mockTimeSlots = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', 
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', 
  '8:00 PM', '9:00 PM'
];

// Mock Pincode Data (for verification)
export const mockValidPincodes = [
  '110001', '110002', '110003', '110004', '110005', // Delhi
  '400001', '400002', '400003', '400004', '400005', // Mumbai
  '560001', '560002', '560003', '560004', '560005', // Bangalore
  '600001', '600002', '600003', '600004', '600005', // Chennai
  '700001', '700002', '700003', '700004', '700005', // Kolkata
  '380001', '380002', '380003', '380004', '380005', // Ahmedabad
  '500001', '500002', '500003', '500004', '500005', // Hyderabad
  '302001', '302002', '302003', '302004', '302005'  // Jaipur
];

// Mock Features by Category
export const mockFeaturesByCategory = {
  anniversary: [
    'Romantic candlelight setup',
    'Premium rose petals decoration',
    'Personalized photo frames',
    'Champagne service',
    'Soft music arrangement',
    'Professional photography',
    'Elegant table setting',
    'Memory book creation'
  ],
  birthday: [
    'Themed party decorations',
    'Birthday cake setup',
    'Balloon arrangements',
    'Party games and activities',
    'Photo booth with props',
    'Gift presentation setup',
    'Entertainment coordination',
    'Surprise element planning'
  ],
  corporate: [
    'Professional event setup',
    'Branded decorations',
    'Networking facilitation',
    'Catering coordination',
    'Audio-visual support',
    'Executive service',
    'Event photography',
    'Post-event cleanup'
  ],
  kids: [
    'Themed decorations',
    'Kid-friendly activities',
    'Safe entertainment',
    'Party games',
    'Character appearances',
    'Cake cutting ceremony',
    'Gift distribution',
    'Parent supervision'
  ],
  festival: [
    'Traditional decorations',
    'Cultural elements',
    'Festive lighting',
    'Rangoli designs',
    'Traditional music',
    'Cultural performances',
    'Festive treats',
    'Religious elements'
  ],
  celebration: [
    'Special occasion setup',
    'Personalized decorations',
    'Memory creation',
    'Gift presentation',
    'Celebration coordination',
    'Photo documentation',
    'Special touches',
    'Event management'
  ]
};

// Mock Experience Details (for different categories)
export const mockExperienceDetails = {
  'romantic-candlelight-dinner': {
    title: 'Romantic Candlelight Dinner',
    shortDesc: 'Intimate candlelight dinner setup for two',
    description: 'Create the perfect romantic atmosphere with our premium candlelight dinner setup. Includes elegant table setting, premium candles, rose petals, and ambient lighting. Perfect for anniversaries, proposals, or special date nights. Our team will transform any space into a magical romantic setting that will create unforgettable memories.',
    basePrice: 2999,
    originalPrice: 3999,
    category: 'anniversary',
    subcategory: 'dinner-movie',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=800&h=600&fit=crop'
    ],
    duration: '3 hours',
    capacity: '2-4 people',
    location: 'Delhi NCR',
    rating: 4.8,
    reviews: 200,
    isFeatured: true,
    templateType: 'special'
  },
  'birthday-surprise-setup': {
    title: 'Birthday Surprise Setup',
    shortDesc: 'Complete birthday surprise decoration package',
    description: 'Transform any space into a birthday wonderland with our comprehensive surprise setup. Includes balloons, banners, confetti, photo booth props, and personalized decorations. Guaranteed to create unforgettable memories and make the birthday person feel truly special.',
    basePrice: 2499,
    originalPrice: 3299,
    category: 'birthday',
    subcategory: 'surprise-dinner',
    images: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514672013381-c6d0df1c8b18?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    duration: '4 hours',
    capacity: '10-20 people',
    location: 'Delhi NCR',
    rating: 4.7,
    reviews: 150,
    isFeatured: true,
    templateType: 'standard'
  }
};

// Helper function to get features by category
export const getFeaturesByCategory = (category: string): string[] => {
  return mockFeaturesByCategory[category.toLowerCase() as keyof typeof mockFeaturesByCategory] || 
         mockFeaturesByCategory.celebration;
};

// Helper function to verify pincode
export const verifyPincode = (pincode: string): boolean => {
  return mockValidPincodes.includes(pincode);
};

// Helper function to get experience details by slug
export const getExperienceDetailsBySlug = (slug: string) => {
  return mockExperienceDetails[slug as keyof typeof mockExperienceDetails] || null;
};
