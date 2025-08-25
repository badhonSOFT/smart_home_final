import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, RefreshCw, User } from 'lucide-react';
import { useState } from 'react';
import navbarLogo from '@/assets/navbar_imgaes.png';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <img src={navbarLogo} alt="Smart Home" className="h-8 w-auto" />
            <Badge variant="outline" className="px-3 py-1 text-sm font-semibold">
              Smart Home Admin
            </Badge>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Button 
              variant="ghost" 
              className={isActive('/admin') ? 'text-gray-900 font-medium' : 'text-gray-600'}
              onClick={() => navigate('/admin')}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className={isActive('/admin/orders') ? 'text-gray-900 font-medium' : 'text-gray-600'}
              onClick={() => navigate('/admin/orders')}
            >
              Orders
            </Button>
            <Button 
              variant="ghost" 
              className={isActive('/admin/reports') ? 'text-gray-900 font-medium' : 'text-gray-600'}
              onClick={() => navigate('/admin/reports')}
            >
              Reports
            </Button>
            <Button 
              variant="ghost" 
              className={isActive('/admin/customers') ? 'text-gray-900 font-medium' : 'text-gray-600'}
              onClick={() => navigate('/admin/customers')}
            >
              Customers
            </Button>
            <Button 
              variant="ghost" 
              className={isActive('/admin/products') ? 'text-gray-900 font-medium' : 'text-gray-600'}
              onClick={() => navigate('/admin/products')}
            >
              Products
            </Button>
            <Button 
              variant="ghost" 
              className={isActive('/admin/users') ? 'text-gray-900 font-medium' : 'text-gray-600'}
              onClick={() => navigate('/admin/users')}
            >
              Users
            </Button>

          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;