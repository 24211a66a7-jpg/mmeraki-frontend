import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/data/events';
import MegaMenu from './MegaMenu';

const OccasionNav = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [menuOffsetX, setMenuOffsetX] = useState(0);

  const handleMouseEnter = (_categorySlug: string) => {};
  const handleMouseLeave = () => {};

  // Scroll-based visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show subnav when at the top of the page
      if (currentScrollY <= 100) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Remove transform-based nudge; we will align visually via padding/margins
  useEffect(() => {
    setMenuOffsetX(0);
  }, [activeMenu]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!activeMenu) return;
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  return (
    <motion.div 
      className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-b border-amber-200/60 sticky top-24 z-40 relative"
      onMouseLeave={() => setActiveMenu(null)}
      ref={containerRef}
      initial={{ opacity: 1, y: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -100
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          <nav className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {(() => {
              const desiredOrder = ['birthdays','anniversary','candlelight','decorations','festivals','kids','corporate'];
              const position: Record<string, number> = {};
              desiredOrder.forEach((slug, idx) => { position[slug] = idx; });
              const ordered = [...categories].sort((a, b) => {
                const pa = position[a.slug] ?? 999;
                const pb = position[b.slug] ?? 999;
                return pa - pb;
              });
              return ordered;
            })().map((category, index) => {
              const isActive = location.pathname === `/${category.slug}`;
              const hasMegaMenu = ['anniversary', 'birthdays', 'festivals', 'decorations', 'candlelight', 'gifts', 'kids'].includes(category.slug);
              const activeStripClass: Record<string, string> = {
                anniversary: 'from-amber-500 via-rose-500 to-purple-600',
                birthdays: 'from-pink-600 via-fuchsia-600 to-rose-500',
                festivals: 'from-emerald-600 via-green-600 to-teal-500',
                decorations: 'from-indigo-600 via-blue-600 to-cyan-500',
                candlelight: 'from-violet-700 via-purple-700 to-fuchsia-600',
                gifts: 'from-rose-600 via-amber-600 to-orange-500',
                kids: 'from-sky-500 via-indigo-500 to-purple-500',
              };
              
              return (
                <div
                  key={category.slug}
                  className="relative"
                >
                   <button
                    ref={(el) => { buttonsRef.current[category.slug] = el; }}
                    type="button"
                    aria-haspopup={hasMegaMenu ? 'true' : undefined}
                    aria-expanded={activeMenu === category.slug}
                     onMouseEnter={() => {
                       if (hasMegaMenu) setActiveMenu(category.slug);
                     }}
                    className={`
                      flex items-center space-x-2 px-4 py-2 text-sm font-medium whitespace-nowrap relative group transition-colors duration-200
                      ${activeMenu === category.slug
                        ? `text-white shadow-md bg-gradient-to-r ${activeStripClass[category.slug]}`
                        : isActive
                          ? 'bg-primary text-white shadow-md rounded-full'
                          : 'text-gray-700 hover:text-amber-800 hover:bg-amber-500/10 rounded-full'
                      }
                    ${activeMenu === category.slug ? 'z-50 rounded-t-2xl rounded-b-none pb-6' : ''}
                    `}
                  >
                    <span className="font-medium leading-[1.25rem] group-hover:font-bold">{category.name}</span>
                    {hasMegaMenu && (
                      <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mega Menu */}
      {activeMenu && (
        <div onMouseEnter={() => {}}>
          <MegaMenu
            isOpen={true}
            onClose={() => setActiveMenu(null)}
            category={activeMenu}
          />
        </div>
      )}
    </motion.div>
  );
};

export default OccasionNav;
