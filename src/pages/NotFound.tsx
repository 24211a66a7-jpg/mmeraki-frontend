import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Use logo from public root so it can be swapped without rebuild
const logoImage = '/mmerakilogo1.png';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Intentionally silent to avoid console noise
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-white to-pink-50">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <img 
            src={logoImage} 
            alt="Mmeraki Logo" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <h1 className="mb-4 text-6xl font-bold bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">404</h1>
        <p className="mb-6 text-xl text-gray-600">Oops! Page not found</p>
        <p className="mb-8 text-gray-500">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold rounded-full hover:from-amber-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
