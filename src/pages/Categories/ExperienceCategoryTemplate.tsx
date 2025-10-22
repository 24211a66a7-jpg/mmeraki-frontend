import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Users, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import Footer from '@/components/Footer';

export interface ExperienceEvent {
  id: string;
  title: string;
  slug: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  capacity: string;
  location: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface ExperienceSubcategory {
  name: string;
  slug: string;
  image?: string;
}

interface ExperienceCategoryTemplateProps {
  heroImage: string;
  subcategories: ExperienceSubcategory[];
  events: ExperienceEvent[];
}

const ExperienceCategoryTemplate: React.FC<ExperienceCategoryTemplateProps> = ({ heroImage, subcategories, events }) => {
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');
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

  const sorted = [...events].sort((a, b) => {
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
    if (a.rating !== b.rating) return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OccasionNav />

      {/* Hero - full bleed */}
      <section className="relative h-[40vh] overflow-hidden">
        <div className="w-screen relative left-1/2 -translate-x-1/2 h-full">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        </div>
      </section>

      {/* Subcategories - circular scroll */}
      <section className="py-8 bg-white border-b">
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 px-4 md:px-6 lg:px-8">
            {subcategories.map((sc) => (
              <Link key={sc.slug} to={`/${sc.slug}`} className="flex-shrink-0 w-48 text-center group">
                <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden ring-4 ring-primary/10 bg-gray-100">
                  {sc.image ? (
                    <img src={sc.image} alt={sc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-base md:text-lg font-semibold text-gray-900">{sc.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-8" ref={eventsSectionRef}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Experiences</h2>
          </div>

          <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {sorted.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-48">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {event.isPopular && (<Badge className="bg-primary text-white">Popular</Badge>)}
                      {event.isNew && (<Badge className="bg-green-500 text-white">New</Badge>)}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">{event.title}</h3>
                      <Badge variant="outline" className="text-xs">{event.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(event.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{event.rating} ({event.reviews} reviews)</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600"><Clock className="w-4 h-4 mr-2" />{event.duration}</div>
                      <div className="flex items-center text-sm text-gray-600"><Users className="w-4 h-4 mr-2" />{event.capacity}</div>
                      <div className="flex items-center text-sm text-gray-600"><MapPin className="w-4 h-4 mr-2" />{event.location}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{event.price}</span>
                        {event.originalPrice && (<span className="text-sm text-gray-500 line-through ml-2">{event.originalPrice}</span>)}
                      </div>
                      <Button className="bg-primary hover:bg-primary/90" asChild>
                        <Link to={`/event/${event.slug || event.id}`}>
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

export default ExperienceCategoryTemplate;


