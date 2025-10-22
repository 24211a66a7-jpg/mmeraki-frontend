import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  LogOut,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
// Use logo from public root so it can be swapped without rebuild
const logoImage = '/mmerakilogo1.png';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Events', href: '/admin/events', icon: Calendar },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header with Logo */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-amber-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo Row */}
          <div className="flex items-center justify-between h-20 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <img 
                src={logoImage} 
                alt="Mmeraki Logo" 
                className="h-12 w-auto object-contain"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                MMeraki Admin
              </h1>
            </div>
            <Button
              variant="outline"
              className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Navigation Row */}
          <nav className="flex items-center space-x-1 py-3 overflow-x-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700 border-2 border-transparent hover:border-amber-200'
                    }
                  `}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;