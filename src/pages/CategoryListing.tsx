import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import Footer from '@/components/Footer';
import { getExperiencesByCategoryAndSubcategory } from '@/data/events';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
}

const toTitle = (slugPart: string | undefined) => {
  if (!slugPart) return '';
  return slugPart
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const CategoryListing: React.FC = () => {
  const params = useParams<{ category?: string; slug?: string }>();
  const location = useLocation() as { state?: { heading?: string; menuTitle?: string; category?: string } };
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract category and slug - handle both /experience/:slug and /:category/:slug
  const category = params.category || location.state?.category || 'experience';
  const slug = params.slug || '';

  const heading = useMemo(() => location.state?.heading || toTitle(slug || category), [location.state, slug, category]);
  const subtitle = useMemo(() => {
    const base = toTitle(slug || category);
    return `Discover curated ${base.toLowerCase()} experiences crafted for memorable celebrations.`;
  }, [category, slug]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Extract subcategory from slug (e.g., /experience/private-couple -> private-couple)
        const subcategory = slug ? slug.split('/').pop() : undefined;
        
        // Fetch experiences by category and subcategory
        const data = await getExperiencesByCategoryAndSubcategory(category, subcategory);
        
        if (mounted) setEvents(data as unknown as EventItem[]);
      } catch (err) {
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [category, slug]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OccasionNav />

      <section className="py-10 bg-gradient-to-b from-amber-50 via-white to-rose-50">
        <div className="container mx-auto px-2 md:px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">{heading || toTitle(category)}</h1>
          <div className="w-40 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 rounded-full mx-auto mt-3" />
          <p className="text-gray-600 mt-3 mb-8 text-center">{subtitle}</p>

          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading listings…</div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center text-gray-500">No experiences found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group rounded-xl p-[1px] bg-gradient-to-r from-white via-amber-100 to-yellow-400 transition-all duration-300 hover:from-yellow-300 hover:via-amber-200 hover:to-yellow-500 hover:shadow-[0_0_18px_rgba(251,191,36,0.35)]"
                >
                  <Card className="rounded-[11px] overflow-hidden bg-white text-card-foreground shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-amber-300/60">
                    <div className="relative h-72 bg-white overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-[96%] h-[96%] object-cover rounded-lg mx-auto my-1 transition-transform duration-300 group-hover:scale-[1.015]" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Button size="icon" variant="ghost" className="bg-white hover:bg-white/90 border border-gray-200 rounded-full">
                          
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900">{event.price}</span>
                          {event.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">{event.originalPrice}</span>
                          )}
                        </div>
                        <Button asChild className="h-9 px-3 text-gray-900 border border-amber-300 bg-gradient-to-r from-white via-amber-200 to-yellow-400 hover:from-white hover:via-amber-300 hover:to-yellow-500">
                          <Link to={`/event/${event.slug || event.id}`} state={{ fromCategory: category, slug }}>
                            <ShoppingCart className="w-4 h-4 mr-2" /> Book
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryListing;


