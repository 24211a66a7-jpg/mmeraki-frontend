import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  availableLocations: string[];
  refreshWebsite: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<string>('Delhi');
  
  // Available locations
  const availableLocations = [
    'Delhi',
    'Gurugram',
    'Noida',
    'Greater Noida',
    'Sonipat',
    'Ghaziabad',
    'Hyderabad',
  ];

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation && availableLocations.includes(savedLocation)) {
      setSelectedLocationState(savedLocation);
    }
  }, []);

  // Save location to localStorage when changed
  const setSelectedLocation = (location: string) => {
    if (availableLocations.includes(location)) {
      setSelectedLocationState(location);
      localStorage.setItem('selectedLocation', location);
    }
  };

  // Function to refresh the website
  const refreshWebsite = () => {
    window.location.reload();
  };

  const value: LocationContextType = {
    selectedLocation,
    setSelectedLocation,
    availableLocations,
    refreshWebsite,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
