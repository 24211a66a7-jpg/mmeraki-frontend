import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Calendar,
  Check,
  ArrowLeft,
  Phone,
  MessageCircle,
  Shield,
  Truck,
  Award,
  ChevronDown,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Pin,
  X,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import Footer from '@/components/Footer';
import birthdayImage from '@/assets/birthday-event.jpg';
import anniversaryImage from '@/assets/anniversary-event.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import { getEventById } from '@/data/events';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { 
  mockAddons, 
  mockReviews, 
  mockSimilarProducts, 
  mockCancellationPolicies, 
  mockTimeSlots,
  getFeaturesByCategory,
  verifyPincode as verifyPincodeHelper
} from '@/data/mockExperienceDetails';

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { selectedLocation } = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!slug) return;
      try {
        setLoading(true);
        // Fetch experience by slug from backend API
      const bySlug = await (await import('@/data/events')).getExperienceBySlug(slug);
      const data = bySlug; // returns Event | null
      if (mounted) setEvent(data);
      } catch (error) {
        if (mounted) setEvent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Helper functions for mock data (moved from events.ts)
  const getMockDuration = (category: string): string => {
    const durations: Record<string, string> = {
      'anniversary': '3 hours',
      'birthday': '4 hours',
      'corporate': '6 hours',
      'kids': '3 hours',
      'festival': '6 hours',
      'celebration': '4 hours'
    };
    return durations[category.toLowerCase()] || '4 hours';
  };

  const getMockCapacity = (category: string): string => {
    const capacities: Record<string, string> = {
      'anniversary': '2-4 people',
      'birthday': '10-20 people',
      'corporate': '20-50 people',
      'kids': '8-15 kids',
      'festival': '20-50 people',
      'celebration': '15-30 people'
    };
    return capacities[category.toLowerCase()] || '10-20 people';
  };

  const getMockFeatures = (category: string): string[] => {
    const features: Record<string, string[]> = {
      'anniversary': ['Romantic setup', 'Premium decorations', 'Photography', 'Personalized touches'],
      'birthday': ['Party decorations', 'Cake setup', 'Entertainment', 'Surprise elements'],
      'corporate': ['Professional setup', 'Catering', 'Networking activities', 'Executive service'],
      'kids': ['Themed decorations', 'Party games', 'Entertainment', 'Kids-friendly setup'],
      'festival': ['Traditional decorations', 'Cultural elements', 'Lighting setup', 'Celebration touches'],
      'celebration': ['Special decorations', 'Entertainment', 'Memory moments', 'Gift presentation']
    };
    return features[category.toLowerCase()] || ['Professional setup', 'Quality service', 'Memorable experience'];
  };

  // Use imported mock data
  const timeSlots = mockTimeSlots;
  const similarProducts = mockSimilarProducts;

  const handlePincodeSubmit = () => {
    // For Delhi and Hyderabad, all pincodes are valid
    const delhiPincodes = ['110001', '110002', '110003', '110004', '110005', '110006', '110007', '110008', '110009', '110010'];
    const hyderabadPincodes = ['500001', '500002', '500003', '500004', '500005', '500006', '500007', '500008', '500009', '500010'];
    
    const validPincodes = selectedLocation === 'Delhi' ? delhiPincodes : hyderabadPincodes;
    
    if (validPincodes.includes(pincode)) {
      setPincodeVerified(true);
      setShowPincodeModal(false);
    } else {
      alert(`Please enter a valid ${selectedLocation} pincode. Service is available in ${selectedLocation} area.`);
    }
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotal = () => {
    const basePrice = eventBasePrice || 0;
    const addonPrice = selectedAddons.reduce((total, addonId) => {
      const addon = mockAddons.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return basePrice + addonPrice;
  };

  // Derive a robust numeric price from backend (handles string/number/null)
  const deriveBasePrice = (e: any): number | undefined => {
    if (!e) return undefined;
    const candidates: Array<unknown> = [
      e.base_price,
      (e.pricing && (e.pricing.base || e.pricing.starting || e.pricing.price)),
      (e.price ?? undefined),
    ];
    for (const candidate of candidates) {
      if (candidate === null || candidate === undefined) continue;
      if (typeof candidate === 'number' && !Number.isNaN(candidate)) return candidate;
      if (typeof candidate === 'string') {
        const parsed = Number(candidate.replace(/[^0-9.]/g, ''));
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
    return undefined;
  };

  const fallbackImages = useMemo(() => [birthdayImage, anniversaryImage, corporateImage], []);
  const eventImages = useMemo(() => {
    if (event?.images && event.images.length > 0) {
      return event.images;
    }
    if (event?.thumbnail_url) {
      return [event.thumbnail_url, ...fallbackImages];
    }
    return fallbackImages;
  }, [event?.images, event?.thumbnail_url, fallbackImages]);
  const eventTitle = event?.title || 'Experience';
  const eventBasePrice = deriveBasePrice(event);
  const eventPrice = typeof eventBasePrice === 'number' ? `₹${eventBasePrice.toLocaleString()}` : '₹—';
  const eventOriginalPrice = typeof eventBasePrice === 'number' && eventBasePrice > 1000
    ? `₹${(eventBasePrice * 1.3).toLocaleString()}`
    : undefined;
  const eventShortDesc = event?.short_desc || '';
  const eventDescription = event?.description || 'Experience the best curated setup tailored for your occasion.';
  const eventDuration = getMockDuration(event?.category || '');
  const eventCapacity = getMockCapacity(event?.category || '');
  const eventLocation = 'Delhi NCR'; // Default location
  const eventCategory = event?.category || 'Experience';
  const eventSubcategory = event?.subcategory || '';
  const eventTemplateType = event?.template_type || 'standard';
  const eventIsFeatured = event?.is_featured || false;
  const eventCreatedAt = event?.created_at || '';

  const handleBooking = async () => {
    if (!event?.id) return;
    
    try {
      // Add the experience to cart with selected options
      await addToCart(event.id, guestCount, {
        selected_date: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
        selected_time: selectedTime || undefined,
        addons: selectedAddons
      });
      
      // Redirect to checkout page
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You could show a toast notification here
    }
  };

  const defaultPackages = useMemo(() => ([
    { id: 'basic', name: 'Basic Package', price: eventPrice, features: ['Decor setup', 'Lighting', 'Basic props'], duration: '3 hours' },
    { id: 'premium', name: 'Premium Package', price: '₹4,999', features: ['Everything in Basic', 'Photography', 'Personalized decor'], duration: '4 hours' },
    { id: 'luxury', name: 'Luxury Package', price: '₹7,999', features: ['Everything in Premium', 'Live music', 'Catering'], duration: '6 hours' }
  ]), [eventPrice]);

  const packages = (event as any)?.packages || defaultPackages;
  const defaultReviews = useMemo(() => ([
    { id: 1, name: 'Happy Customer', rating: 5, date: '2024-01-10', comment: 'Amazing experience! Highly recommend!', verified: true },
    { id: 2, name: 'Satisfied Client', rating: 4, date: '2024-01-05', comment: 'Great quality and service.', verified: false }
  ]), []);
  const reviews = (event as any)?.reviews || defaultReviews;

  const eventVendor = (event as any)?.vendor;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <OccasionNav />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-gray-600">Loading experience details…</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <OccasionNav />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-gray-600">Experience not found.</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      <Navbar />
      <OccasionNav />
      
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-amber-100 to-rose-100 py-4 border-b border-amber-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Link to="/" className="hover:text-amber-800 font-medium">Home</Link>
            <span>/</span>
            <Link to="/experience" className="hover:text-amber-800 font-medium">Experiences</Link>
            <span>/</span>
            <Link to={`/${eventCategory}`} className="hover:text-amber-800 font-medium capitalize">{eventCategory}</Link>
            <span>/</span>
            <span className="text-amber-900 font-semibold">{eventTitle}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - All Content */}
          <div className="space-y-16">
            {/* Experience Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{eventTitle}</h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-4">{eventShortDesc}</p>
                <p className="text-base text-gray-500 leading-relaxed">{event?.description || 'Experience the best curated setup tailored for your occasion.'}</p>
                </div>
                
              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900">4.8</span>
                </div>
                <span className="text-gray-500">(200+ reviews)</span>
                      </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-amber-600">{eventPrice}</span>
                {eventOriginalPrice && (
                  <span className="text-xl text-gray-500 line-through">{eventOriginalPrice}</span>
                )}
                {eventOriginalPrice && (
                  <Badge className="bg-red-100 text-red-600">Save ₹{Math.round((parseInt(eventOriginalPrice.replace(/[^0-9]/g, '')) - parseInt(eventPrice.replace(/[^0-9]/g, ''))) / 1000)}K</Badge>
                )}
                      </div>

              {/* Pincode Verification */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Pin className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Check availability in {selectedLocation}</p>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        placeholder={`Enter ${selectedLocation} pincode`}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="max-w-40"
                        maxLength={6}
                      />
                      <Button 
                        onClick={handlePincodeSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Check
                      </Button>
                    </div>
                    {pincodeVerified && (
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <Check className="w-4 h-4 mr-1" />
                        Service available in {selectedLocation}
                      </p>
                    )}
                  </div>
                    </div>
                  </div>
                </div>

            {/* Booking Form */}
            <Card className="border-2 border-amber-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="text-2xl text-gray-900">Book This Experience</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left h-12">
                        <Calendar className="w-5 h-5 mr-3" />
                        {selectedDate ? selectedDate.toLocaleDateString() : 'Choose your preferred date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Time</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Total Calculation */}
                <div className="bg-gray-50 p-4 rounded-xl">
                <div className="space-y-2">
                  <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-semibold">{eventPrice}</span>
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons</span>
                        <span className="font-semibold">₹{selectedAddons.reduce((total, addonId) => {
                          const addon = mockAddons.find(a => a.id === addonId);
                          return total + (addon?.price || 0);
                        }, 0).toLocaleString()}</span>
                  </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                        <span className="text-amber-600">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-lg shadow-lg"
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-14 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold text-lg"
                    onClick={() => {
                      if (event?.id) {
                        addToCart(event.id, 1, {
                          selected_date: selectedDate ? selectedDate.toISOString().split('T')[0] : undefined,
                          selected_time: selectedTime || undefined,
                          addons: selectedAddons
                        });
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      <span>Free Delivery</span>
                    </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    <span>Quality Assured</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add-ons Section */}
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-2xl text-gray-900">Recommended Add-ons</CardTitle>
                <p className="text-gray-600">Enhance your experience with these popular add-ons</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockAddons.map((addon) => (
                    <div
                      key={addon.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all min-h-[120px] ${
                        selectedAddons.includes(addon.id)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => handleAddonToggle(addon.id)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900 break-words">{addon.name}</h4>
                          <p className="text-gray-600 text-sm mt-1 break-words line-clamp-2">{addon.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-lg font-bold text-purple-600">₹{addon.price.toLocaleString()}</div>
                          {selectedAddons.includes(addon.id) && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inclusions Section */}
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-2xl text-gray-900">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFeaturesByCategory(eventCategory).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About Experience Section */}
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-2xl text-gray-900">About This Experience</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{event?.description || eventDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-2 border-yellow-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
                <CardTitle className="text-2xl text-gray-900">Customer Reviews</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">4.8 out of 5</span>
                  <span className="text-gray-600">(200+ reviews)</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            {review.verified && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {review.helpful}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Need to Know Section */}
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Info className="w-6 h-6 mr-2" />
                  Need to Know
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Before You Book</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Confirmation will be sent within 24 hours</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Free cancellation up to 48 hours before</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Weather backup plan available</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What to Bring</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Valid ID for verification</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Comfortable clothing</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Camera for memories (optional)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="border-2 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-gray-700">
                  {mockCancellationPolicies.map((policy) => (
                    <div 
                      key={policy.id}
                      className={`p-4 rounded-lg border ${
                        policy.color === 'green' ? 'bg-green-50 border-green-200' :
                        policy.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-red-50 border-red-200'
                      }`}
                    >
                      <h4 className={`font-semibold mb-2 ${
                        policy.color === 'green' ? 'text-green-800' :
                        policy.color === 'yellow' ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {policy.title}
                      </h4>
                      <p>{policy.description}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Time Limit:</strong> {policy.timeLimit} • 
                        <strong> Refund:</strong> {policy.refundPercentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Fixed Image Gallery */}
          <div className="sticky top-24 h-screen overflow-hidden">
            <div className="relative group h-full">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl h-full">
                <img
                  src={eventImages[currentImageIndex]}
                  alt={eventTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation Arrows */}
                {eventImages.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? eventImages.length - 1 : prev - 1)}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCurrentImageIndex(prev => prev === eventImages.length - 1 ? 0 : prev + 1)}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  {eventIsFeatured && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                      ⭐ Featured
                    </Badge>
                  )}
                  {eventTemplateType === 'special' && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                      ✨ Special
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white shadow-lg">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>

                {/* Why Mmeraki Section */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Why Mmeraki?</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Premium quality experiences</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Professional team</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>100% satisfaction guarantee</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Memorable moments created</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {eventImages.length > 1 && (
                <div className="flex space-x-3 mt-4 overflow-x-auto scrollbar-hide">
                  {eventImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-amber-500 shadow-lg' 
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${eventTitle} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products - Full Width After Fixed Content */}
        <div className="mt-16">
          <Card className="border-2 border-indigo-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="text-2xl text-gray-900">Similar Experiences</CardTitle>
              <p className="text-gray-600">You might also like these experiences</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProducts.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {product.featured && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                            ⭐ Featured
                          </Badge>
                        )}
                        
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-xl font-bold text-indigo-600">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                          )}
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                          <Link to={`/event/${product.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetail;