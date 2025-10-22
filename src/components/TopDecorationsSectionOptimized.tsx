import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, Clock, Users } from 'lucide-react';
import { getEventsByCategory, getExperiencesBySubcategories } from '@/data/events';
import { useSessionData } from '@/hooks/useSessionData';
import { Event } from '@/data/events';

interface TopDecorationsSectionOptimizedProps {
  sectionNumber: number;
  category: string;
  subcategories?: string[];
  title: string;
  gradientClass: string;
  textColor: string;
}

const TopDecorationsSectionOptimized: React.FC<TopDecorationsSectionOptimizedProps> = ({
  sectionNumber,
  category,
  subcategories,
  title,
  gradientClass,
  textColor
}) => {
  // Fetch events only once per session using session-based caching
  const { data: events, loading, error } = useSessionData<Event[]>({
    key: `top-decorations-${sectionNumber}-${category}`,
    fetchFunction: async () => {
      let categoryEvents: Event[] = [];
      
      if (subcategories && subcategories.length > 0) {
        // Try to fetch from specific subcategories first
        try {
          categoryEvents = await getExperiencesBySubcategories(subcategories);
        } catch (subError) {
          // Failed to fetch from subcategories, will fallback to category
        }
        
        // If no events found from subcategories, fallback to general category
        if (categoryEvents.length === 0) {
          categoryEvents = await getEventsByCategory(category);
        }
      } else {
        // Fetch from general category
        categoryEvents = await getEventsByCategory(category);
      }
      
      return categoryEvents.slice(0, 10); // Limit to 10 events
    },
    dependencies: [category, subcategories]
  });

  const renderEventCard = (event: Event, index: number) => (
    <motion.div
      key={`${event.id}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-80 bg-white/95 rounded-2xl border border-gray-200 overflow-hidden shadow-sm backdrop-blur-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-56">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/src/assets/birthday-event.jpg'; // Fallback image
          }}
        />
        <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
          <Heart className="w-4 h-4 text-gray-700 hover:text-red-500" />
        </button>
        {event.isPopular && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
        {event.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            New
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1 mb-1">
          {event.title}
        </h3>
        
        <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <MapPin className="w-4 h-4" />
          {event.location}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Clock className="w-4 h-4" />
          <span>{event.duration}</span>
          <Users className="w-4 h-4 ml-2" />
          <span>{event.capacity}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-primary font-bold text-sm md:text-base">
              {event.price}
            </div>
            {event.originalPrice && (
              <div className="text-xs text-gray-500 line-through">
                {event.originalPrice}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{event.rating.toFixed(1)}</span>
            <span className="text-gray-400">({event.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to={`/event/${event.slug}`} 
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-primary text-white py-1.5 text-xs md:text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Book Now
          </Link>
          <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSkeletonCard = (index: number) => (
    <div
      key={`skeleton-${index}`}
      className="flex-shrink-0 w-80 bg-white/95 rounded-2xl border border-gray-200 overflow-hidden shadow-sm backdrop-blur-sm animate-pulse"
    >
      <div className="h-56 bg-gray-200"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className={`py-12 ${gradientClass} relative`}>
      <div className="w-screen relative left-1/2 -translate-x-1/2">
        <div className="px-4 md:px-6 lg:px-8 flex items-end justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textColor}`}>
            {title}
          </h2>
          <Link 
            to={`/${category}`} 
            className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-6">
          {[0, 1].map((rowIdx) => (
            <div key={rowIdx} className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 px-4 md:px-6 lg:px-8">
              {loading ? (
                // Show skeleton loading cards
                Array.from({ length: 5 }).map((_, index) => renderSkeletonCard(index))
              ) : error ? (
                // Show error state
                <div className="flex-shrink-0 w-full flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">Failed to load events</div>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-primary text-sm hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : !events || events.length === 0 ? (
                // Show empty state
                <div className="flex-shrink-0 w-full flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">No events available</div>
                    <div className="text-sm text-gray-400">Check back later for new events</div>
                  </div>
                </div>
              ) : (
                // Show actual event cards
                events.slice(rowIdx * 5, (rowIdx + 1) * 5).map((event, index) => 
                  renderEventCard(event, rowIdx * 5 + index)
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDecorationsSectionOptimized;
