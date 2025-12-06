//
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import Footer from '@/components/Footer';
import birthdayImage from '@/assets/birthday-event.jpg';
import anniversaryImage from '@/assets/anniversary-event.jpg';
import corporateImage from '@/assets/corporate-event.jpg';

const BirthdayPage = () => {
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategories] = useState<string[]>([]);
  const priceRange = [0, Infinity];
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');

  const subcategories = [
    { name: 'For Him', slug: 'for-him', count: 45 },
    { name: 'For Her', slug: 'for-her', count: 52 },
    { name: 'Kids', slug: 'kids', count: 38 },
    { name: '1st Birthday', slug: 'first-birthday', count: 28 },
    { name: '18th Birthday', slug: 'eighteenth-birthday', count: 15 },
    { name: 'Car Boot Surprise', slug: 'car-boot', count: 12 },
    { name: 'Terrace Party', slug: 'terrace', count: 20 },
    { name: 'Rosegold Theme', slug: 'rosegold', count: 25 }
  ];

  // gradients removed per new image-forward design

  const subcategoryImages: Record<string, string> = {
    'for-him': anniversaryImage,
    'for-her': birthdayImage,
    'kids': birthdayImage,
    'first-birthday': birthdayImage,
    'eighteenth-birthday': anniversaryImage,
    'car-boot': corporateImage,
    'terrace': birthdayImage,
    'rosegold': birthdayImage
  };

  const eventsSectionRef = useRef<HTMLDivElement | null>(null);
  const [showSortBar, setShowSortBar] = useState(false);

  useEffect(() => {
    if (!eventsSectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowSortBar(entry.isIntersecting);
      },
      { root: null, threshold: 0.1 }
    );
    observer.observe(eventsSectionRef.current);
    return () => observer.disconnect();
  }, []);

  const birthdayEvents = [
    {
      id: '1',
      title: 'Rosegold Birthday Surprise',
      price: '₹2,999',
      originalPrice: '₹3,999',
      image: birthdayImage,
      rating: 4.9,
      reviews: 127,
      duration: '4 hours',
      capacity: '10-20 people',
      location: 'Delhi NCR',
      category: 'For Her',
      isPopular: true,
      isNew: false,
      features: ['Rosegold decorations', 'Balloon setup', 'Cake arrangement', 'Photography']
    },
    {
      id: '2',
      title: 'Superhero Kids Party',
      price: '₹1,999',
      image: birthdayImage,
      rating: 4.8,
      reviews: 89,
      duration: '3 hours',
      capacity: '8-15 kids',
      location: 'Delhi NCR',
      category: 'Kids',
      isPopular: false,
      isNew: true,
      features: ['Superhero theme', 'Party games', 'Entertainment', 'Kids-friendly setup']
    },
    {
      id: '3',
      title: 'Masculine Birthday Setup',
      price: '₹2,499',
      image: anniversaryImage,
      rating: 4.7,
      reviews: 67,
      duration: '4 hours',
      capacity: '15-25 people',
      location: 'Delhi NCR',
      category: 'For Him',
      isPopular: false,
      isNew: false,
      features: ['Masculine theme', 'Premium decorations', 'Entertainment', 'Catering']
    },
    {
      id: '4',
      title: 'First Birthday Celebration',
      price: '₹1,499',
      image: birthdayImage,
      rating: 4.9,
      reviews: 156,
      duration: '3 hours',
      capacity: '20-30 people',
      location: 'Delhi NCR',
      category: '1st Birthday',
      isPopular: true,
      isNew: false,
      features: ['Baby-friendly setup', 'Memory moments', 'Photography', 'Gift presentation']
    },
    {
      id: '5',
      title: 'Car Boot Surprise',
      price: '₹3,999',
      image: corporateImage,
      rating: 4.8,
      reviews: 45,
      duration: '2 hours',
      capacity: '2-4 people',
      location: 'Delhi NCR',
      category: 'Car Boot Surprise',
      isPopular: false,
      isNew: true,
      features: ['Car decoration', 'Surprise element', 'Photography', 'Memory creation']
    },
    {
      id: '6',
      title: 'Terrace Birthday Party',
      price: '₹2,199',
      image: birthdayImage,
      rating: 4.6,
      reviews: 78,
      duration: '5 hours',
      capacity: '25-40 people',
      location: 'Delhi NCR',
      category: 'Terrace Party',
      isPopular: false,
      isNew: false,
      features: ['Outdoor setup', 'Premium decorations', 'Catering', 'Entertainment']
    }
  ];

  const handleCategoryToggle = (_category: string) => {};

  const filteredEvents = birthdayEvents.filter(event => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const priceNumber = Number(event.price.replace('₹', '').replace(/,/g, ''));
    const matchesPrice = priceNumber >= priceRange[0] && priceNumber <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OccasionNav />
      
      {/* Hero Section - Full-bleed image, no text */}
      <section className="relative h-[40vh] overflow-hidden">
        <div className="w-screen relative left-1/2 -translate-x-1/2 h-full">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${birthdayImage})` }}
          />
        </div>
      </section>

      {/* Subcategories - Round scrollable image cards */}
      <section className="py-8 bg-white border-b">
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 px-4 md:px-6 lg:px-8">
            {subcategories.map((subcategory, idx) => (
              <Link
                key={subcategory.slug}
                to={`/birthdays/${subcategory.slug}`}
                className="flex-shrink-0 w-48 text-center group"
              >
                <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden ring-4 ring-primary/10 bg-gray-100">
                  <img
                    src={subcategoryImages[subcategory.slug] || birthdayImage}
                    alt={subcategory.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <div className="text-base md:text-lg font-semibold text-gray-900">{subcategory.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search removed as per request */}

      {/* Events Grid */}
      <section className="py-8" ref={eventsSectionRef}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Experiences</h2>
          </div>

          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {([...filteredEvents].sort((a, b) => {
              if (sortBy === 'price-low') {
                const pa = Number(a.price.replace('₹','').replace(/,/g,''));
                const pb = Number(b.price.replace('₹','').replace(/,/g,''));
                return pa - pb;
              }
              if (sortBy === 'price-high') {
                const pa = Number(a.price.replace('₹','').replace(/,/g,''));
                const pb = Number(b.price.replace('₹','').replace(/,/g,''));
                return pb - pa;
              }
              // recommended by rating then reviews
              if (a.rating !== b.rating) return b.rating - a.rating;
              return b.reviews - a.reviews;
            })).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={viewMode === 'grid' ? '' : 'flex gap-4'}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'h-32 w-48 flex-shrink-0'}`}>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {event.isPopular && (
                        <Badge className="bg-primary text-white">Popular</Badge>
                      )}
                      {event.isNew && (
                        <Badge className="bg-green-500 text-white">New</Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                        
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {event.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(event.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {event.rating} ({event.reviews} reviews)
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {event.capacity}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{event.price}</span>
                        {event.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {event.originalPrice}
                          </span>
                        )}
                      </div>
                       <Button 
                         className="bg-primary hover:bg-primary/90"
                         asChild
                       >
                         <Link to={`/event/${event.id}`}>
                           <ShoppingCart className="w-4 h-4 mr-2" />
                           Book Now
                         </Link>
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found.</p>
            </div>
          )}
        </div>
      </section>

      {showSortBar && (
        <div className="fixed bottom-4 inset-x-0 flex justify-center z-40">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-3 py-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-1 h-auto rounded-full text-sm">
                  Sort: {sortBy === 'price-low' ? 'Price Low to High' : sortBy === 'price-high' ? 'Price High to Low' : 'Recommended'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="min-w-[220px]">
                <DropdownMenuItem onClick={() => setSortBy('recommended')}>Recommended</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-low')}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-high')}>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BirthdayPage;    
//