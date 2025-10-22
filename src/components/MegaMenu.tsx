import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Heart, Gift, Cake, Sparkles, Home, Baby, PartyPopper } from 'lucide-react';
import { menuData as sharedMenuData } from '@/data/menuConfig';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, category }) => {
  const icons: Record<string, JSX.Element> = {
    anniversary: <Heart className="w-5 h-5" />,
    birthdays: <Cake className="w-5 h-5" />,
    festivals: <Sparkles className="w-5 h-5" />,
    decorations: <Home className="w-5 h-5" />,
    candlelight: <Sparkles className="w-5 h-5" />,
    gifts: <Gift className="w-5 h-5" />,
    kids: <PartyPopper className="w-5 h-5" />,
  };

  // Build menuData by merging shared content with local icons
  const menuData = Object.fromEntries(
    Object.entries(sharedMenuData).map(([key, value]) => [
      key,
      { ...value, icon: icons[key] }
    ])
  ) as Record<string, typeof sharedMenuData[keyof typeof sharedMenuData] & { icon: JSX.Element }>;

  const currentMenu = menuData[category as keyof typeof menuData];

  const styleMap: Record<string, {
    frame: string;
    accentBorder: string;
    accentDot: string;
    hoverBorder: string;
    hoverBg: string;
    viewAllText: string;
  }> = {
    anniversary: {
      frame: 'from-amber-500 via-rose-500 to-purple-600',
      accentBorder: 'border-amber-300/60',
      accentDot: 'bg-amber-400',
      hoverBorder: 'hover:border-amber-300/80',
      hoverBg: 'hover:bg-amber-50/60',
      viewAllText: 'text-amber-800 hover:text-amber-900'
    },
    birthdays: {
      frame: 'from-pink-600 via-fuchsia-600 to-rose-500',
      accentBorder: 'border-pink-300/60',
      accentDot: 'bg-pink-400',
      hoverBorder: 'hover:border-pink-300/80',
      hoverBg: 'hover:bg-pink-50/60',
      viewAllText: 'text-pink-800 hover:text-pink-900'
    },
    festivals: {
      frame: 'from-emerald-600 via-green-600 to-teal-500',
      accentBorder: 'border-emerald-300/60',
      accentDot: 'bg-emerald-400',
      hoverBorder: 'hover:border-emerald-300/80',
      hoverBg: 'hover:bg-emerald-50/60',
      viewAllText: 'text-emerald-800 hover:text-emerald-900'
    },
    decorations: {
      frame: 'from-indigo-600 via-blue-600 to-cyan-500',
      accentBorder: 'border-indigo-300/60',
      accentDot: 'bg-indigo-400',
      hoverBorder: 'hover:border-indigo-300/80',
      hoverBg: 'hover:bg-indigo-50/60',
      viewAllText: 'text-indigo-800 hover:text-indigo-900'
    },
    candlelight: {
      frame: 'from-violet-700 via-purple-700 to-fuchsia-600',
      accentBorder: 'border-violet-300/60',
      accentDot: 'bg-violet-400',
      hoverBorder: 'hover:border-violet-300/80',
      hoverBg: 'hover:bg-violet-50/60',
      viewAllText: 'text-violet-800 hover:text-violet-900'
    },
    gifts: {
      frame: 'from-rose-600 via-amber-600 to-orange-500',
      accentBorder: 'border-rose-300/60',
      accentDot: 'bg-rose-400',
      hoverBorder: 'hover:border-rose-300/80',
      hoverBg: 'hover:bg-rose-50/60',
      viewAllText: 'text-rose-800 hover:text-rose-900'
    },
    kids: {
      frame: 'from-sky-500 via-indigo-500 to-purple-500',
      accentBorder: 'border-sky-300/60',
      accentDot: 'bg-sky-400',
      hoverBorder: 'hover:border-sky-300/80',
      hoverBg: 'hover:bg-sky-50/60',
      viewAllText: 'text-sky-800 hover:text-sky-900'
    },
  };
  const style = styleMap[category] || styleMap['birthdays'];

  if (!isOpen || !currentMenu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 w-full z-50"
      onMouseLeave={onClose}
    >
      {/* Thin curved gradient frame centered, not edge-to-edge */}
      <div className="mx-auto px-4 pt-0 pb-0 max-w-6xl -mt-3.5">
        <div className={`bg-gradient-to-r ${style.frame} rounded-2xl p-[2px] shadow-xl`}>
          <div className="rounded-2xl bg-white/95 backdrop-blur">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-5 pt-3">
              <div className="flex items-center space-x-4 text-gray-900">
                {currentMenu.icon}
                <h3 className="text-2xl font-bold">{currentMenu.title}</h3>
              </div>
              <div className="hidden md:block text-gray-500 text-sm font-medium">
                Curated selections • Handpicked for you
              </div>
            </div>

            {/* Dropdown content box with fixed max width and scroll if content grows */}
            <div className={`border-0 rounded-2xl px-5 pb-5 pt-3 max-h-[65vh] overflow-y-auto`}> 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentMenu.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 inline-flex items-center">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${style.accentDot} mr-2`} />
                      {section.title}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            to={item.link}
                            state={{ heading: item.name, menuTitle: currentMenu.title, category }}
                            className={`flex items-center justify-between group rounded-lg px-3 py-2 border border-transparent ${style.hoverBorder} ${style.hoverBg} transition-colors`}
                            onClick={onClose}
                          >
                            <span className="text-base md:text-lg text-gray-700 group-hover:text-gray-900">
                              {item.name}
                            </span>
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {/* View All Link */}
              <div className="mt-8 pt-6 border-t border-black/10 flex justify-end">
                <Link
                  to={`/${category}`}
                  className={`inline-flex items-center ${style.viewAllText} font-semibold`}
                  onClick={onClose}
                >
                  View All {currentMenu.title} Experiences
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
