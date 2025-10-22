export type MenuItem = { name: string; link: string };
export type MenuSection = { title: string; items: MenuItem[] };
export type MenuCategory = {
  title: string;
  sections: MenuSection[];
};

export const menuData: Record<string, MenuCategory> = {
  anniversary: {
    title: 'Anniversary',
    sections: [
      {
        title: 'Candlelight Dinners',
        items: [
          { name: 'Private Couple Experiences', link: '/experience/private-couple' },
          { name: 'Rooftop Dinners', link: '/experience/rooftop-dinners' },
          { name: 'Poolside Candlelight Dinners', link: '/experience/poolside-candlelight-dinners' },
          { name: 'Private Dinner & Movie', link: '/experience/private-dinner-movie' }
        ]
      },
      {
        title: 'Decorations',
        items: [
          { name: 'Anniversary Party Decors', link: '/experience/anniversary-party-decorations' },
          { name: 'Hotel Room Decoration', link: '/experience/hotel-decorations' },
          { name: '1st Anniversary Decors', link: '/experience/first-anniversary' },
          { name: '25th Anniversary Decors', link: '/experience/25th-anniversary' },
          { name: '50th Anniversary Decors', link: '/experience/50th-anniversary' },
          { name: 'Canopy Decorations at Home', link: '/experience/canopy-decorations-at-home' },
          { name: 'Wedding Night Decorations', link: '/experience/wedding-night-decorations' }
        ]
      },
      {
        title: 'Experience Gifts',
        items: [
          { name: 'Bubble Balloon Buckets', link: '/experience/bubble-balloon-buckets' },
          { name: 'Photo Frames', link: '/experience/photo-frames' },
          { name: 'Balloon Box Surprise', link: '/experience/balloon-box-surprise' },
          { name: 'Digital Surprises', link: '/experience/digital-surprises' },
          { name: 'Cake & Bouquet Combos', link: '/experience/cake-bouquet-combos' },
          { name: 'Photo Gifts', link: '/experience/photo-gifts' },
          { name: 'Heart Shape Cakes', link: '/experience/heart-shape-cakes' },
          { name: 'Bouquets', link: '/experience/bouquets' }
        ]
      }
    ]
  },
  birthdays: {
    title: 'Birthdays',
    sections: [
      {
        title: 'Candlelight Dinners',
        items: [
          { name: 'Romantic Birthday Dinner', link: '/experience/romantic-birthday-dinner' },
          { name: 'Surprise Dinner Setup', link: '/experience/surprise-dinner-setup' },
          { name: 'Private Couple Experiences', link: '/experience/private-couple' },
          { name: 'Rooftop Dinners', link: '/experience/rooftop-dinners' },
          { name: 'Poolside Candlelight Dinners', link: '/experience/poolside-candlelight-dinners' },
          { name: 'Private Dinner & Movie', link: '/experience/private-dinner-movie' }
        ]
      },
      {
        title: 'Birthday Decorations',
        items: [
          { name: 'Birthday Decors for Him', link: '/experience/birthday-decors-for-him' },
          { name: 'Birthday Decors for Her', link: '/experience/birthday-decors-for-her' },
          { name: '1st Birthday Decorations', link: '/experience/first-birthday-decorations' },
          { name: '18th Birthday Special', link: '/experience/eighteenth-birthday-special' },
          { name: 'Car Boot Decorations', link: '/experience/car-boot-decorations' },
          { name: 'Terrace Decorations', link: '/experience/terrace-decorations' },
          { name: 'Rosegold Themed Decorations', link: '/experience/decorations/rosegold' },
          { name: 'Kids Themed Decorations', link: '/experience/kids-themed-decorations' }
        ]
      },
      {
        title: 'Birthday Gifts',
        items: [
          { name: 'Bubble Balloon Buckets', link: '/experience/bubble-balloon-buckets' },
          { name: 'Photo Frames', link: '/experience/photo-frames' },
          { name: 'Balloon Box Surprise', link: '/experience/balloon-box-surprise' },
          { name: 'Digital Surprises', link: '/experience/digital-surprises' },
          { name: 'Cake & Bouquet Combos', link: '/experience/cake-bouquet-combos' },
          { name: 'Photo Gifts', link: '/experience/photo-gifts' },
          { name: 'Heart Shape Cakes', link: '/experience/heart-shape-cakes' },
          { name: 'Bouquets', link: '/experience/bouquets' }
        ]
      }
    ]
  },
  festivals: {
    title: 'Festivals',
    sections: [
      {
        title: 'By Occasion',
        items: [
          { name: 'Lohri (13th Jan)', link: '/experience/lohri-13th-jan' },
          { name: "Valentine's Day (14th Feb)", link: '/experience/valentines-day' },
          { name: 'Holi', link: '/experience/holi' },
          { name: 'Diwali', link: '/experience/diwali' },
          { name: 'Christmas', link: '/experience/christmas' },
          { name: 'New Year', link: '/experience/new-year' },
          { name: "Women's Day", link: '/experience/womens-day' },
          { name: "Mother's Day", link: '/experience/mothers-day' },
          { name: "Father's Day", link: '/experience/fathers-day' },
          { name: 'Navratri', link: '/experience/navratri' },
          { name: 'Ganesh Chaturthi', link: '/experience/ganesh-chaturthi' },
          { name: 'Karva Chauth', link: '/experience/karva-chauth' },
          { name: 'Halloween', link: '/experience/halloween' }
        ]
      }
    ]
  },
  decorations: {
    title: 'Decorations',
    sections: [
      {
        title: 'By Type',
        items: [
          { name: 'Balloon Decorations', link: '/experience/balloon-decorations' },
          { name: 'Rosegold Themed Decorations', link: '/experience/rosegold-themed-decorations' },
          { name: 'Umbrella Decorations', link: '/experience/umbrella-decorations' },
          { name: 'Flower Decorations', link: '/experience/flower-decorations' }
        ]
      },
      {
        title: 'By Occasion',
        items: [
          { name: 'Baby Shower', link: '/experience/baby-shower' },
          { name: 'Kids Birthday Party', link: '/experience/kids-birthday-party' },
          { name: 'Birthday Decorations', link: '/experience/birthday-decorations' },
          { name: 'Welcome Baby Decorations', link: '/experience/welcome-baby-decorations' },
          { name: 'Anniversary Decorations', link: '/experience/anniversary-decorations' },
          { name: 'Pre-Wedding Events', link: '/experience/pre-wedding-events' },
          { name: 'First Night Decorations', link: '/experience/first-night-decorations' },
          { name: 'Festive Decorations', link: '/experience/festive-decorations' },
          { name: 'Bachelorette Decorations', link: '/experience/bachelorette-decorations' }
        ]
      },
      {
        title: 'Kids Theme Decor',
        items: [
          { name: 'Minion Theme Decorations', link: '/experience/minion-theme-decorations' },
          { name: 'Unicorn Decorations', link: '/experience/unicorn-decorations' },
          { name: 'Superhero Theme Decorations', link: '/experience/superhero-theme-decorations' },
          { name: 'Harry Potter Decorations', link: '/experience/harry-potter-decorations' },
          { name: 'Peppa Pig Decorations', link: '/experience/peppa-pig-decorations' },
          { name: 'All Kids Themes', link: '/experience/all-kids-themes' }
        ]
      }
    ]
  },
  candlelight: {
    title: 'Candlelight Dinners',
    sections: [
      {
        title: 'Categories',
        items: [
          { name: 'Private Couple Experiences', link: '/experience/private-couple' },
          { name: 'Rooftop Dinners', link: '/experience/rooftop-dinners' },
          { name: 'Poolside Candlelight Dinners', link: '/experience/poolside-candlelight-dinners' },
          { name: 'Private Dinner & Movie', link: '/experience/private-dinner-movie' }
        ]
      },
      {
        title: 'Our Recommendations',
        items: [
          { name: 'Private Supreme Show Movie Experience', link: '/experience/private-supreme-show-movie-experience' },
          { name: 'Open Air Poolside Dining', link: '/experience/open-air-poolside' },
          { name: 'Open Air Candlelight Dinner', link: '/experience/open-air-candlelight-dinner' },
          { name: 'Rooftop Candlelight Dinner', link: '/experience/rooftop-candlelight-dinner' },
          { name: 'Dinner on a Swing', link: '/experience/dinner-on-a-swing' }
        ]
      }
    ]
  },
  gifts: {
    title: 'Gifts',
    sections: [
      {
        title: 'Personalized Gifts',
        items: [
          { name: 'Custom Photo Frames', link: '/experience/custom-photo-frames' },
          { name: 'Personalized Mugs', link: '/experience/personalized-mugs' },
          { name: 'Custom T-shirts', link: '/experience/custom-t-shirts' },
          { name: 'Engraved Items', link: '/experience/engraved-items' }
        ]
      },
      {
        title: 'Experience Gifts',
        items: [
          { name: 'Spa Vouchers', link: '/experience/spa-vouchers' },
          { name: 'Dining Experiences', link: '/experience/dining-experiences' },
          { name: 'Adventure Activities', link: '/experience/adventure-activities' },
          { name: 'Workshop Classes', link: '/experience/workshop-classes' }
        ]
      },
      {
        title: 'Digital Surprises',
        items: [
          { name: 'Video Messages', link: '/experience/video-messages' },
          { name: 'Digital Photo Albums', link: '/experience/digital-photo-albums' },
          { name: 'Online Experiences', link: '/experience/online-experiences' },
          { name: 'Virtual Celebrations', link: '/experience/virtual-celebrations' }
        ]
      }
    ]
  },
  kids: {
    title: 'Kids Celebrations',
    sections: [
      {
        title: 'Birthday Parties',
        items: [
          { name: '1st Birthday', link: '/experience/first-birthday' },
          { name: 'Theme Parties', link: '/experience/theme-parties' },
          { name: 'Pool Parties', link: '/experience/pool-parties' },
          { name: 'Outdoor Adventures', link: '/experience/outdoor-adventures' }
        ]
      },
      {
        title: 'Special Occasions',
        items: [
          { name: 'Baby Shower', link: '/experience/baby-shower' },
          { name: 'Welcome Baby', link: '/experience/welcome-baby' },
          { name: 'Graduation', link: '/experience/graduation' },
          { name: 'Achievement Celebrations', link: '/experience/achievement-celebrations' }
        ]
      },
      {
        title: 'Entertainment',
        items: [
          { name: 'Magicians', link: '/experience/magicians' },
          { name: 'Face Painting', link: '/experience/face-painting' },
          { name: 'Balloon Artists', link: '/experience/balloon-artists' },
          { name: 'Games & Activities', link: '/experience/games-activities' }
        ]
      }
    ]
  }
};

export const slugFromLink = (link: string) => link.replace(/^\/?experience\//, '').replace(/^\//, '');

export const getCategories = () => Object.keys(menuData);

export const getSubcategoryOptions = (categoryKey: string) => {
  const category = menuData[categoryKey as keyof typeof menuData];
  if (!category) return [] as { label: string; value: string }[];
  const options: { label: string; value: string }[] = [];
  for (const section of category.sections) {
    for (const item of section.items) {
      const value = slugFromLink(item.link);
      options.push({ label: item.name, value });
    }
  }
  return options;
};


