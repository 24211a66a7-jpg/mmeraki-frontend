import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
  stats?: Array<{
    icon: React.ReactNode;
    value: string;
    label: string;
  }>;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText = "Explore Now",
  ctaLink = "/experiences",
  className,
  stats = []
}) => {
  return (
    <div className={className ? className : "relative h-96 md:h-[500px] overflow-hidden"}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay disabled to keep image at full visibility */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Content removed to keep banner fully image-only */}
      
      {/* Stats */}
      {stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-transparent">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
