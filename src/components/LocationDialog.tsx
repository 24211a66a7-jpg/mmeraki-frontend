import React from 'react';
import { X, Check } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
}

const LocationDialog: React.FC<LocationDialogProps> = ({ open, onClose }) => {
  const { selectedLocation, setSelectedLocation, availableLocations, refreshWebsite } = useLocation();

  if (!open) return null;

  const cityImages: Record<string, string> = {
    Delhi: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&crop=center',
    Gurugram: 'https://wearegurgaon.com/wp-content/uploads/2017/04/monuments-in-gurgaon.jpg',
    Noida: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpS9SyT7cWzPzRpJzR0ncpzRTAaqyGLF6aCg&s',
    'Greater Noida': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/c3/8c/25/rashtriya-dalit-prerna.jpg?w=1200&h=-1&s=1',
    Sonipat: 'https://d2gsigjpujdc9o.cloudfront.net/images/locations/places/1719307886_khwaja-khizr-tomb.jpg',
    Ghaziabad: 'https://cdn1.tripoto.com/media/filter/tst/img/11485/SpotDocument/37492696.jpg.webp',
    Hyderabad: 'https://tse2.mm.bing.net/th/id/OIP.AtEl-e6mkfyGWwMSMtdlvQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3?w=400&h=300&fit=crop&crop=center',
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    // Close dialog after a short delay to show selection
    setTimeout(() => {
      onClose();
      // Refresh website to reflect the new location
      refreshWebsite();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div className="relative mx-auto mt-6 max-w-4xl px-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Where do we serve?</h3>
                <p className="text-sm text-gray-600 mt-1">Select a city to personalize your experience.</p>
              </div>
              <button aria-label="Close" className="p-2 rounded-full hover:bg-gray-100" onClick={onClose}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {availableLocations.map((city) => (
                <button 
                  key={city} 
                  onClick={() => handleLocationSelect(city)}
                  className={`relative rounded-xl border-2 text-left overflow-hidden transition-all duration-200 ${
                    selectedLocation === city 
                      ? 'border-purple-500 bg-purple-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="w-full aspect-square bg-gray-100">
                    <img src={cityImages[city]} alt={`${city} landmark`} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 line-clamp-1">{city}</div>
                      </div>
                      {selectedLocation === city && (
                        <div className="flex items-center justify-center w-5 h-5 bg-purple-500 rounded-full ml-2 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDialog;
