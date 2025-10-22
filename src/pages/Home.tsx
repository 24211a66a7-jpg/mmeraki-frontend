import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Calendar, Heart, Gift, Sparkles, ChevronLeft, ChevronRight, Clock, Truck, Shield, Award, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import EventHighlights from '@/components/EventHighlights';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import EventCard from '@/components/EventCard';
import TopDecorationsSectionOptimized from '@/components/TopDecorationsSectionOptimized';
import { getFeaturedEvents, categories } from '@/data/events';
import { useSessionData } from '@/hooks/useSessionData';
import heroImage from '@/assets/hero-main.jpg';
import birthdayImage from '@/assets/birthday-event.jpg';
import anniversaryImage from '@/assets/anniversary-event.jpg';
import corporateImage from '@/assets/corporate-event.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch featured events only once per session
  const { data: featuredEvents, loading: featuredLoading, error: featuredError } = useSessionData({
    key: 'home-featured-events',
    fetchFunction: getFeaturedEvents
  });

  const heroSlides = [
    {
      title: "Celebrate Life's Moments with MMeraki",
      subtitle: "Create unforgettable memories with our premium event experiences",
      image: heroImage,
      ctaText: "Explore Experiences",
      ctaLink: "/experiences"
    },
    {
      title: "Romantic Anniversary Celebrations",
      subtitle: "Make your special moments magical with our curated anniversary packages",
      image: anniversaryImage,
      ctaText: "View Anniversary Packages",
      ctaLink: "/anniversary"
    },
    {
      title: "Birthday Surprises & Celebrations",
      subtitle: "Turn every birthday into an extraordinary celebration",
      image: birthdayImage,
      ctaText: "Plan Birthday Party",
      ctaLink: "/birthdays"
    }
  ];


  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const featuredFrames = [
    {
      title: 'Diwali Special',
      image: 'https://cheetah.cherishx.com/website_layout/1758954399__original_layout_55.jpg?format=avif',
      link: '/festivals/diwali',
      color: 'from-violet-500 to-purple-600',
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      title: 'Birthdays',
      image: birthdayImage,
      link: '/birthdays',
      color: 'from-pink-500 to-purple-600',
      icon: <Cake className="w-8 h-8" />
    },
    {
      title: 'Baby Shower',
      image: birthdayImage,
      link: '/kids/baby-shower',
      color: 'from-green-500 to-emerald-600',
      icon: <Gift className="w-8 h-8" />
    },
    {
      title: 'Candlelight Dinners',
      image: anniversaryImage,
      link: '/candlelight',
      color: 'from-amber-500 to-yellow-600',
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      title: 'Baby Welcome',
      image: anniversaryImage,
      link: '/kids/welcome-baby',
      color: 'from-sky-500 to-blue-600',
      icon: <Heart className="w-8 h-8" />
    },
    {
      title: 'House Warming',
      image: anniversaryImage,
      link: '/decorations/house-warming',
      color: 'from-orange-500 to-red-600',
      icon: <Gift className="w-8 h-8" />
    },
    {
      title: 'Haldi/Mehandi',
      image: anniversaryImage,
      link: '/anniversary/haldi-mehandi',
      color: 'from-rose-500 to-pink-600',
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      title: 'Wedding Anniversary',
      image: anniversaryImage,
      link: '/anniversary',
      color: 'from-indigo-500 to-purple-600',
      icon: <Heart className="w-8 h-8" />
    }
  ];

  const trendingExperiences = [
    {
      title: 'Rooftop Candlelight Dinner',
      price: '₹2,999',
      image: anniversaryImage,
      rating: 4.9,
      reviews: 127,
      link: '/candlelight/rooftop'
    },
    {
      title: 'Birthday Surprise Setup',
      price: '₹1,999',
      image: birthdayImage,
      rating: 4.8,
      reviews: 89,
      link: '/birthdays/surprise-setup'
    },
    {
      title: 'Anniversary Room Decoration',
      price: '₹2,499',
      image: anniversaryImage,
      rating: 4.9,
      reviews: 156,
      link: '/anniversary/room-decoration'
    },
    {
      title: 'Corporate Team Building',
      price: '₹4,999',
      image: corporateImage,
      rating: 4.7,
      reviews: 34,
      link: '/corporate/team-building'
    },
    {
      title: 'Kids Theme Party',
      price: '₹1,499',
      image: birthdayImage,
      rating: 4.8,
      reviews: 67,
      link: '/kids/theme-party'
    },
    {
      title: 'Festival Decoration',
      price: '₹3,499',
      image: anniversaryImage,
      rating: 4.6,
      reviews: 45,
      link: '/festivals/decoration'
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      text: "Mmeraki made our anniversary absolutely magical! The attention to detail was incredible."
    },
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      text: "Best event planning service in Delhi NCR. Highly recommend for any celebration!"
    },
    {
      name: "Anita Singh",
      location: "Gurgaon",
      rating: 5,
      text: "Professional, creative, and reliable. They exceeded all our expectations!"
    }
  ];

  const sectionGradients = [
    'bg-gradient-to-r from-pink-50 via-rose-100 to-pink-50',
    'bg-gradient-to-r from-gray-900 via-black to-gray-900',
    'bg-gradient-to-r from-green-50 via-emerald-100 to-green-50',
    'bg-gradient-to-r from-pink-50 via-fuchsia-100 to-pink-50'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OccasionNav />
      
      {/* Loading indicator for featured events */}
      {featuredLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-blue-400 animate-spin" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Loading featured events...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 w-full h-full ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat rounded-3xl"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Frames */}
      <section className="py-16 bg-white relative overflow-hidden rounded-2xl">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#D4AF37]/40 to-transparent" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular event categories and create unforgettable moments.
            </p>
          </motion.div>

        </div>

        {/* Full-bleed grid */}
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-4 px-4 md:px-6 lg:px-8">
            {featuredFrames.slice(0, 8).map((frame, index) => (
              <motion.div
                key={frame.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={frame.link}>
                  <Card className="overflow-hidden border-0 shadow-sm aspect-square">
                    <div className="relative h-full">
                      <img
                        src={frame.image}
                        alt={frame.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Remove gradient overlay to keep image fully visible */}
                      <div className={`absolute inset-0 bg-transparent`} />
                      {/* Overlay content removed as per request (no icon or title) */}
                    </div>
                  </Card>
                </Link>
                <h3 className="mt-3 text-base md:text-lg font-bold text-center text-black">
                  {frame.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight Section - Trending Experiences */}
      {/* Secondary Banner */}
      <section className="py-12">
        <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden">
            <Banner
              title="Celebrate Every Moment"
              subtitle="Discover curated decorations and experiences for every occasion"
              backgroundImage={heroImage}
              ctaText="Explore Packages"
              ctaLink="/experiences"
              className="relative h-64 md:h-80 rounded-3xl overflow-hidden"
            />
          </div>
        </div>
      </section>

      {/* Top Decorations Sections with Real Data */}
      <React.Fragment>
        {/* Top Decorations 1 - Birthdays */}
        <TopDecorationsSectionOptimized
          sectionNumber={1}
          category="birthdays"
          subcategories={[
            "Birthday Decorations",
            "Birthday Decors for Him",
            "Birthday Decors for Her",
            "1st Birthday Decorations",
            "18th Birthday Special",
            "Car Boot Decorations",
            "Terrace Decorations",
            "Rosegold Themed Decorations",
            "Kids Themed Decorations"
          ]}
          title="Top Decorations 1 - Birthday Celebrations"
          gradientClass="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50"
          textColor="text-gray-900"
        />
        
        {/* Banner between sections */}
        <div className="h-[2px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0 w-screen relative left-1/2 -translate-x-1/2" />
        <section className="py-10">
          <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
            <div className="rounded-3xl overflow-hidden">
              <Banner
                title="Bring Your Vision To Life"
                subtitle="Handpicked decor themes for every celebration"
                backgroundImage={heroImage}
                ctaText="Explore Themes"
                ctaLink="/experiences"
                className="relative h-56 md:h-72 rounded-3xl overflow-hidden"
              />
            </div>
          </div>
        </section>
        
        {/* Top Decorations 2 - Anniversary */}
        <TopDecorationsSectionOptimized
          sectionNumber={2}
          category="anniversary"
          title="Top Decorations 2 - Anniversary Celebrations"
          gradientClass="bg-gradient-to-r from-purple-600 via-purple-700 to-amber-600"
          textColor="text-white"
        />
        
        {/* Banner between sections */}
        <div className="h-[2px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0 w-screen relative left-1/2 -translate-x-1/2" />
        <section className="py-10">
          <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
            <div className="rounded-3xl overflow-hidden">
              <Banner
                title="Bring Your Vision To Life"
                subtitle="Handpicked decor themes for every celebration"
                backgroundImage={heroImage}
                ctaText="Explore Themes"
                ctaLink="/experiences"
                className="relative h-56 md:h-72 rounded-3xl overflow-hidden"
              />
            </div>
          </div>
        </section>
        
        {/* Top Decorations 3 - Kids Celebrations */}
        <TopDecorationsSectionOptimized
          sectionNumber={3}
          category="kids"
          title="Top Decorations 3 - Kids Celebrations"
          gradientClass="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50"
          textColor="text-gray-900"
        />
        
        {/* Banner between sections */}
        <div className="h-[2px] bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0 w-screen relative left-1/2 -translate-x-1/2" />
        <section className="py-10">
          <div className="w-screen relative left-1/2 -translate-x-1/2 px-4 md:px-6 lg:px-8">
            <div className="rounded-3xl overflow-hidden">
              <Banner
                title="Bring Your Vision To Life"
                subtitle="Handpicked decor themes for every celebration"
                backgroundImage={heroImage}
                ctaText="Explore Themes"
                ctaLink="/experiences"
                className="relative h-56 md:h-72 rounded-3xl overflow-hidden"
              />
            </div>
          </div>
        </section>
        
        {/* Top Decorations 4 - Festivals */}
        <TopDecorationsSectionOptimized
          sectionNumber={4}
          category="festivals"
          title="Top Decorations 4 - Festival Celebrations"
          gradientClass="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50"
          textColor="text-gray-900"
        />
      </React.Fragment>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Experiences
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending event experiences that customers love.
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
              {trendingExperiences.map((experience, index) => (
                <motion.div
                  key={experience.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-shrink-0 w-80"
                >
                  <Link to={experience.link}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-sm group">
                      <div className="relative h-48">
                        <img
                          src={experience.image}
                          alt={experience.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-white">
                            {experience.price}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {experience.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(experience.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {experience.rating} ({experience.reviews} reviews)
                          </span>
                        </div>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <EventHighlights />

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose MMeraki?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring years of experience and passion to every event, ensuring your special moments are perfect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="w-12 h-12 text-primary" />,
                title: "Affordable Prices",
                description: "Premium quality experiences at competitive prices that fit your budget"
              },
              {
                icon: <Users className="w-12 h-12 text-primary" />,
                title: "Trusted by 1M+ Customers",
                description: "Join millions of satisfied customers who trust us with their special moments"
              },
              {
                icon: <Sparkles className="w-12 h-12 text-primary" />,
                title: "Unique Experiences",
                description: "Every event is uniquely crafted to create memorable and personalized experiences"
              },
              {
                icon: <Truck className="w-12 h-12 text-primary" />,
                title: "Same Day Delivery",
                description: "Quick and reliable same-day delivery for urgent celebrations and surprises"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 shadow-sm border-0">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-purple-700 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Magic?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us help you plan the perfect celebration. Contact us today for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-black text-amber-400 hover:bg-gray-800 rounded-full px-8 py-3"
                asChild
              >
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-black text-black bg-transparent hover:bg-black hover:text-amber-400 rounded-full px-8 py-3"
                asChild
              >
                <Link to="/experiences">
                  Browse Events
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;