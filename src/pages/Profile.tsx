import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  Heart, 
  Settings,
  Edit,
  Save,
  X,
  Eye,
  Download,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Navbar from '@/components/Navbar';
import OccasionNav from '@/components/OccasionNav';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import birthdayImage from '@/assets/birthday-event.jpg';
import anniversaryImage from '@/assets/anniversary-event.jpg';
import corporateImage from '@/assets/corporate-event.jpg';

const Profile = () => {
  const { user, isAuthenticated, updateProfile, logout, isLoading, verifyToken } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  // Form state for editing
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    current_location: 'Delhi',
    gender: '',
    date_of_birth: '',
    profile_icon: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Ensure profile data is fetched from backend on mount/refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!isLoading && token && (!user || !isAuthenticated)) {
      // This calls GET /api/auth/verify then GET /api/auth/profile
      verifyToken();
    }
  }, [isLoading, isAuthenticated, user, verifyToken]);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        current_location: user.current_location || 'Delhi',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        profile_icon: user.profile_icon || ''
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      // Convert form data to proper types
      const updateData = {
        ...formData,
        gender: formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined
      };
      
      await updateProfile(updateData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Note: Requires backend endpoint to exist
      const res = await api.delete<any>('/auth/delete-account');
      if (res || res === undefined) {
        logout();
        navigate('/');
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted.",
        });
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock orders data
  const orders = [
    {
      id: 'MM2024001',
      date: '2024-01-15',
      status: 'completed',
      total: 2999,
      items: [
        {
          title: 'Rosegold Birthday Surprise',
          image: birthdayImage,
          quantity: 1,
          price: 2999
        }
      ],
      eventDate: '2024-01-20',
      eventTime: '2:00 PM'
    },
    {
      id: 'MM2024002',
      date: '2024-01-10',
      status: 'in-progress',
      total: 4999,
      items: [
        {
          title: 'Romantic Anniversary Dinner',
          image: anniversaryImage,
          quantity: 1,
          price: 2499
        },
        {
          title: 'Corporate Team Building',
          image: corporateImage,
          quantity: 1,
          price: 2500
        }
      ],
      eventDate: '2024-01-22',
      eventTime: '7:00 PM'
    },
    {
      id: 'MM2024003',
      date: '2024-01-05',
      status: 'cancelled',
      total: 1999,
      items: [
        {
          title: 'Kids Theme Party',
          image: birthdayImage,
          quantity: 1,
          price: 1999
        }
      ],
      eventDate: '2024-01-18',
      eventTime: '3:00 PM'
    }
  ];

  // Mock wishlist data
  const wishlist = [
    {
      id: '1',
      title: 'Luxury Anniversary Setup',
      image: anniversaryImage,
      price: 7999,
      originalPrice: 9999,
      rating: 4.9,
      reviews: 89
    },
    {
      id: '2',
      title: 'Premium Birthday Party',
      image: birthdayImage,
      price: 5999,
      originalPrice: 6999,
      rating: 4.8,
      reviews: 156
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <OccasionNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profile_icon} />
                <AvatarFallback className="text-2xl">
                  {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.full_name || formData.full_name || 'User'}
                  </h1>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isUpdating}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{user.phone_number || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.current_location || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Member since {user.created_at ? new Date(user.created_at).getFullYear() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    <span>{user.past_orders?.length || 0} orders</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>₹{user.past_orders?.reduce((total, order) => total + (order.total || 0), 0).toLocaleString() || 0} spent</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.past_orders?.length || 0}</div>
                  <p className="text-xs text-gray-600">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{user.past_orders?.reduce((total, order) => total + (order.total || 0), 0).toLocaleString() || 0}</div>
                  <p className="text-xs text-gray-600">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Wishlist Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.wishlisted_items?.length || 0}</div>
                  <p className="text-xs text-gray-600">Saved items</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={order.items[0].image}
                          alt={order.items[0].title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{order.items[0].title}</h4>
                          <p className="text-sm text-gray-600">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.eventDate} at {order.eventTime}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{order.total.toLocaleString()}</div>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link to="/profile?tab=orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{order.total.toLocaleString()}</div>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="font-medium">₹{item.price.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Event Date: {order.eventDate} at {order.eventTime}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                          </Button>
                          {order.status === 'completed' && (
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">Save events you love to your wishlist</p>
                    <Button asChild>
                      <Link to="/birthdays">Browse Events</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="group">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                {item.rating} ({item.reviews} reviews)
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}</span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ₹{item.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button size="sm">Add to Cart</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Fields marked with * were collected during signup. You can add additional information to complete your profile.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your phone number (optional)"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="current_location">Location *</Label>
                    <select
                      id="current_location"
                      value={formData.current_location}
                      onChange={(e) => handleInputChange('current_location', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
                    >
                      <option value="Delhi">🏙️ Delhi</option>
                      <option value="Hyderabad">🏛️ Hyderabad</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50"
                    >
                      <option value="">Select Gender (optional)</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Select your date of birth (optional)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="profile_icon">Profile Image URL</Label>
                  <Input
                    id="profile_icon"
                    value={formData.profile_icon}
                    onChange={(e) => handleInputChange('profile_icon', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://example.com/your-image.jpg (optional)"
                  />
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates about your orders</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive text message updates</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, sms: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive browser notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-900">Delete Account</h4>
                      <p className="text-sm text-red-600">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          {isDeleting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete Account'
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers including:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Your profile information</li>
                              <li>All your orders and order history</li>
                              <li>Your wishlist items</li>
                              <li>Your payment methods</li>
                              <li>All other account data</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting Account...
                              </>
                            ) : (
                              'Yes, delete my account'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;