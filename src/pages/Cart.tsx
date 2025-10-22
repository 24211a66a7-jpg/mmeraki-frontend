import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight,
  MapPin,
  Shield,
  Truck,
  CreditCard,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import birthdayImage from '@/assets/birthday-event.jpg';
import { useLocation } from '@/context/LocationContext';

const Cart = () => {
  const { items, total, removeFromCart, isLoading } = useCart();
  const { selectedLocation } = useLocation();
  const subtotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const calcOriginal = (base: number | undefined) => {
    if (typeof base !== 'number') return undefined;
    return base > 1000 ? Math.round(base * 1.3) : undefined;
  };

  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <OccasionNav />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any events to your cart yet.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/birthdays">
                Browse Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OccasionNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <img
                        src={item.thumbnail_url || birthdayImage}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            <div className="text-sm text-green-700 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Available in {selectedLocation}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary mb-2">
                              ₹{(item.base_price || 0).toLocaleString()}
                            </div>
                            {calcOriginal(item.base_price) && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{calcOriginal(item.base_price)!.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.experience_id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove from Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {/* Minimal UI per requirements */}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{(total || subtotal).toLocaleString()}</span>
                </div>

                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      <span>Free Delivery</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Trust */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Why Choose MMeraki?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-3 text-green-500" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-3 text-blue-500" />
                  <span>Same Day Delivery Available</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-3 text-purple-500" />
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-3 text-orange-500" />
                  <span>Trusted by 1M+ Customers</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;