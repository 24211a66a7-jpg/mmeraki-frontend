import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedEvents } from '@/data/events';
import { useFetchControl } from '@/hooks/useFetchControl';
import EventCard from './EventCard';

const EventHighlights = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { canFetch, isRefreshed, queueRequest } = useFetchControl({ 
    delayAfterRefresh: 30000,
    componentId: 'event-highlights'
  }); // 30 seconds delay

  useEffect(() => {
    if (!canFetch) {
      setLoading(false);
      return; // Don't fetch if fetch is disabled (e.g., after refresh)
    }

    const fetchFeaturedEvents = async () => {
      try {
        const events = await queueRequest(() => getFeaturedEvents());
        setFeaturedEvents(events);
      } catch (error) {
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [canFetch]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Experiences
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and trending event experiences, carefully curated for your special moments.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))
          ) : featuredEvents.length > 0 ? (
            featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No featured events available at the moment.</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-3"
          >
            View All Experiences
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventHighlights;
