import React from 'react';
import ExperienceCategoryTemplate, { ExperienceEvent, ExperienceSubcategory } from './ExperienceCategoryTemplate';
import anniversaryImage from '@/assets/anniversary-event.jpg';

const subcategories: ExperienceSubcategory[] = [
  { name: 'Romantic Dinners', slug: 'anniversary-dinners', image: anniversaryImage },
  { name: 'Room Decor', slug: 'anniversary-decor', image: anniversaryImage },
  { name: 'Proposals', slug: 'anniversary-proposals', image: anniversaryImage }
];

const events: ExperienceEvent[] = [];

const AnniversaryPage: React.FC = () => (
  <ExperienceCategoryTemplate heroImage={anniversaryImage} subcategories={subcategories} events={events} />
);

export default AnniversaryPage;


