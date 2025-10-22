import React from 'react';
import ExperienceCategoryTemplate, { ExperienceEvent, ExperienceSubcategory } from './ExperienceCategoryTemplate';

interface GenericCategoryPageProps {
  heroImage: string;
  subcategories: ExperienceSubcategory[];
  events: ExperienceEvent[];
}

const GenericCategoryPage: React.FC<GenericCategoryPageProps> = ({ heroImage, subcategories, events }) => {
  return (
    <ExperienceCategoryTemplate heroImage={heroImage} subcategories={subcategories} events={events} />
  );
};

export default GenericCategoryPage;


