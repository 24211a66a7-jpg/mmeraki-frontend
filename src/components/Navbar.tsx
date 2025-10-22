import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, HelpCircle, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LoginDialog from '@/components/LoginDialog';
import LocationDialog from '@/components/LocationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
// Use logo from public root so it can be swapped without rebuild
const logoImage = '/mmerakilogo1.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'mobile' | 'email'>('mobile');
  const [searchQuery, setSearchQuery] = useState('');
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { selectedLocation } = useLocation();
  const navigate = useNavigate();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Disable Esc-to-close to enforce modal only closes via explicit action

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 via-white to-amber-50 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-20 md:h-24 w-56 md:w-72 flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoImage} 
                    alt="Mmeraki Logo" 
                    className="h-full w-full object-contain drop-shadow-md scale-125"
                  />
                </div>
              </Link>
            </motion.div>

            {/* Search Bar - Desktop */}
            <motion.form 
              onSubmit={handleSearch} 
              className="hidden md:flex flex-1 max-w-md mx-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
                <Input
                  placeholder="Search experiences, gifts, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-gray-900 placeholder-gray-500 border border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-colors rounded-full h-14"
                />
              </div>
            </motion.form>

            {/* Right Side Icons */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Help Center - Always visible */}
              <Link to="/help">
                <Button variant="ghost" className="hidden md:flex items-center space-x-1 text-sm text-gray-700 hover:text-amber-800 rounded-full bg-amber-500/10 hover:bg-amber-500/20 px-3 py-3 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help Center</span>
                </Button>
              </Link>

              {/* Location - Always visible */}
              <Button variant="ghost" className="hidden md:flex items-center space-x-1 text-sm text-gray-700 hover:text-amber-800 rounded-full bg-amber-500/10 hover:bg-amber-500/20 px-3 py-3 transition-colors" onClick={() => setIsLocationOpen(true)}>
                <MapPin className="w-4 h-4" />
                <span>{selectedLocation}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>

              {/* Before Login - Show Login Button */}
              {!isAuthenticated && (
                <Button variant="ghost" className="flex items-center space-x-1 text-sm text-gray-700 hover:text-amber-800 rounded-full bg-amber-500/10 hover:bg-amber-500/20 px-3 py-3 transition-colors" onClick={() => setIsLoginOpen(true)}>
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Button>
              )}

              {/* After Login - Show Profile Icon and Cart */}
              {isAuthenticated && (
                <>
                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-1 text-sm text-gray-700 hover:text-amber-800 rounded-full bg-amber-500/10 hover:bg-amber-500/20 px-3 py-3 transition-colors">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg" align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/profile">My Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Wishlist</Link>
                      </DropdownMenuItem>
                      {user?.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin/events">Add New Listing</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Cart - Only visible after login */}
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative text-gray-800 hover:text-amber-800 rounded-full bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      {cartItemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-pink-600 text-white">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-800 hover:text-amber-800 rounded-full bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden py-4 border-t border-gray-200 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
                  <Input
                    placeholder="Search experiences, gifts, events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white text-gray-900 placeholder-gray-500 border border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-300 focus:border-amber-400 rounded-full h-14"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-4 space-y-2">
              <Link
                to="/birthdays"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Birthdays
              </Link>
              <Link
                to="/anniversary"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Anniversary
              </Link>
              <Link
                to="/candlelight"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Candlelight Dinners
              </Link>
              <Link
                to="/decorations"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Decorations
              </Link>
              <Link
                to="/festivals"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Festivals
              </Link>
              <Link
                to="/kids"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kids Celebrations
              </Link>
              <Link
                to="/corporate"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Corporate Events
              </Link>
              <Link
                to="/gifts"
                className="block py-2 text-gray-700 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gifts
              </Link>
              
              {/* Mobile Login/User Section */}
              <div className="pt-4 border-t border-gray-200">
                {/* Before Login - Show Login Button */}
                {!isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-center space-x-2 text-sm text-gray-700 hover:text-amber-800 bg-amber-500/10 hover:bg-amber-500/20 py-3 transition-colors"
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 px-2">
                      Hello, {user?.full_name || 'User'}
                    </div>
                    <Link
                      to="/profile"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/cart"
                      className="block py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cart ({cartItemCount})
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin/events"
                        className="block py-2 text-gray-700 hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Add New Listing
                      </Link>
                    )}
                    <button
                      className="block w-full text-left py-2 text-gray-700 hover:text-primary transition-colors"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      <LoginDialog open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <LocationDialog open={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  );
};

export default Navbar;