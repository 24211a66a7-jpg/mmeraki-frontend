import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Check,
  Calendar,
  Clock,
  Users,
  Gift,
  Truck,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Removed Navbar, OccasionNav, and Footer for cleaner checkout experience
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import birthdayImage from '@/assets/birthday-event.jpg';
import anniversaryImage from '@/assets/anniversary-event.jpg';
import corporateImage from '@/assets/corporate-event.jpg';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, refreshCart } = useCart();

  const orderItems = useMemo(() => items.map(i => ({
    id: i.id,
    title: i.title,
    category: i.category,
    price: i.base_price,
    quantity: i.quantity ?? 1,
    image: i.thumbnail_url || birthdayImage,
    date: (i as any).selected_date,
    time: (i as any).selected_time,
    location: 'Delhi NCR'
  })), [items]);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0), [orderItems]);
  const serviceFee = useMemo(() => subtotal * 0.05, [subtotal]); // 5%
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const steps = [
    { id: 1, title: 'Customer Details', description: 'Your information' },
    { id: 2, title: 'Payment', description: 'Payment method' },
    { id: 3, title: 'Confirmation', description: 'Order summary' }
  ];

  // Admin WhatsApp number with normalization (auto-add 91 if 10 digits)
  const rawWhatsApp = (import.meta as any)?.env?.VITE_ADMIN_WHATSAPP || '9182591431';
  const adminWhatsApp = (() => {
    const digits = String(rawWhatsApp).replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits; // assume India if 10 digits
  })();

  const sendWhatsAppToAdmin = () => {
    try {
      const itemsText = orderItems
        .map((it, idx) => `${idx + 1}. ${it.title} x${it.quantity} - ₹${(it.price || 0).toLocaleString()}${it.date ? `, ${it.date}` : ''}${it.time ? ` ${it.time}` : ''}`)
        .join('\n');
      const text = [
        `New Order Received ✅`,
        `Name: ${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
        `Phone: ${customerInfo.phone}`,
        `Email: ${customerInfo.email}`,
        `Address: ${customerInfo.address}, ${customerInfo.city} ${customerInfo.pincode}, ${customerInfo.state}`,
        `Date: ${selectedDate || 'N/A'}`,
        `Time: ${selectedTime || 'N/A'}`,
        `Payment: ${paymentMethod.toUpperCase()}`,
        `\nItems:\n${itemsText}`,
        `\nSubtotal: ₹${subtotal.toLocaleString()}`,
        `Service Fee: ₹${serviceFee.toLocaleString()}`,
        `Total: ₹${total.toLocaleString()}`
      ].join('\n');

      const url = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(text)}`;
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    } catch (_) {
      // no-op if WhatsApp open fails
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field: string, value: string) => {
    setCardInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const data = await api.post<any>('/orders', {
        customer: customerInfo,
        paymentMethod,
        selectedDate,
        selectedTime
      });
      if (!data || data.error) {
        throw new Error(data?.message || 'Failed to place order');
      }
      setIsProcessing(false);
      setCurrentStep(3);
      // Send WhatsApp notification to admin with order details
      sendWhatsAppToAdmin();
      // Ensure cart reflects backend clear
      try { await refreshCart(); } catch {}
    } catch (e) {
      setIsProcessing(false);
      alert((e as any).message || 'Failed to place order');
    }
  };

  const isStep1Valid = customerInfo.firstName && customerInfo.lastName && 
                      customerInfo.email && customerInfo.phone && 
                      customerInfo.address && customerInfo.city && 
                      customerInfo.pincode;

  const isStep2Valid = paymentMethod === 'card' ? 
    (cardInfo.cardNumber && cardInfo.expiryDate && cardInfo.cvv && cardInfo.cardName) :
    paymentMethod === 'upi' || paymentMethod === 'wallet';

  return (
    <div className="min-h-screen bg-background">
      {/* Clean checkout page without navigation distractions */}
      <div className="container mx-auto px-4 py-8">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Complete your event booking</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Secure checkout</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="ml-3">
                  <div className={`font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Customer Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={customerInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your complete address"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={customerInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={customerInfo.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="Enter pincode"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={customerInfo.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={handleNext}
                        disabled={!isStep1Valid}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date & Time selection for the order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sel-date">Event Date *</Label>
                        <Input
                          id="sel-date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sel-time">Time Slot *</Label>
                        <Input
                          id="sel-time"
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                <span>Credit/Debit Card</span>
                              </div>
                              <div className="flex space-x-1">
                                <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center">V</div>
                                <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-purple-500 rounded text-white text-xs flex items-center justify-center mr-2">UPI</div>
                              <span>UPI Payment</span>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="wallet" id="wallet" />
                          <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center mr-2">₹</div>
                              <span>Digital Wallet</span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={cardInfo.expiryDate}
                              onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={cardInfo.cvv}
                              onChange={(e) => handleCardChange('cvv', e.target.value)}
                              placeholder="123"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Name on Card *</Label>
                          <Input
                            id="cardName"
                            value={cardInfo.cardName}
                            onChange={(e) => handleCardChange('cardName', e.target.value)}
                            placeholder="Enter name as on card"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevious}>
                        Back
                      </Button>
                      <Button 
                        onClick={handlePayment}
                        disabled={!isStep2Valid || isProcessing || !selectedDate || !selectedTime}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isProcessing ? 'Processing...' : 'Complete Payment'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      Order Confirmed!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Thank you for your booking!
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Your order has been confirmed. You will receive a confirmation email shortly.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Order ID: #MM2024001</p>
                        <p className="text-sm text-gray-600">Payment ID: #PAY2024001</p>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <Button asChild variant="outline">
                        <Link to="/profile">View Orders</Link>
                      </Button>
                      <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link to="/">Continue Shopping</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.category}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{item.date || 'N/A'}{item.time ? ` at ${item.time}` : ''}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>₹{serviceFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

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

            {/* Security Info */}
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
    </div>
  );
};

export default Checkout;