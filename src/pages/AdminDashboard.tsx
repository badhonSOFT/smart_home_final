import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, TrendingUp, ShoppingCart, CreditCard, Banknote } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';
import { orderStore } from '@/lib/orderStore';

const AdminDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState(orderStore.getTodaysStats());
  const [todaysOrders, setTodaysOrders] = useState(orderStore.getTodaysOrders());

  useEffect(() => {
    const unsubscribe = orderStore.subscribe(() => {
      setStats(orderStore.getTodaysStats());
      setTodaysOrders(orderStore.getTodaysOrders());
    });
    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setStats(orderStore.getTodaysStats());
    setTodaysOrders(orderStore.getTodaysOrders());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const metrics = [
    { title: 'Total Orders Today', value: stats.totalOrders.toString(), subtitle: new Date().toLocaleDateString(), icon: ShoppingCart },
    { title: 'COD Orders Today', value: stats.codOrders.toString(), subtitle: `${stats.totalOrders ? Math.round((stats.codOrders / stats.totalOrders) * 100) : 0}% of today's orders`, icon: Banknote },
    { title: 'Online Orders Today', value: stats.onlineOrders.toString(), subtitle: `${stats.totalOrders ? Math.round((stats.onlineOrders / stats.totalOrders) * 100) : 0}% of today's orders`, icon: CreditCard },
    { title: 'Today\'s Revenue', value: `৳${stats.revenue.toLocaleString()}`, subtitle: `From ${stats.totalOrders} order${stats.totalOrders !== 1 ? 's' : ''} today`, icon: TrendingUp },
  ];

  const lowStockItems = [
    { name: 'Smart Roller Curtain - White', category: 'Roller', stock: 0, image: '/placeholder.svg' },
    { name: 'Sliding Curtain Motor', category: 'Accessories', stock: 3, image: '/placeholder.svg' },
    { name: 'Remote Control', category: 'Accessories', stock: 2, image: '/placeholder.svg' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-sm font-medium text-gray-900 mb-1">{metric.title}</p>
              <p className="text-xs text-gray-500">{metric.subtitle}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock Alert */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
                <p className="text-sm text-gray-500">{lowStockItems.length} items running low on stock</p>
              </div>
            </div>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-3 rounded-lg ${
                    item.stock <= 3 ? 'border-2 border-red-200 bg-red-50' : 'bg-gray-50'
                  }`}
                >
                  <Package className="w-10 h-10 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <Badge variant={item.stock === 0 ? 'destructive' : 'secondary'}>
                    {item.stock} left
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Orders */}
          <Card className="p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Today's Orders</h2>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All →
              </Button>
            </div>
            <div className="space-y-4">
              {todaysOrders.length > 0 ? todaysOrders.slice(0, 3).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{order.customer}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.placedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="font-semibold text-gray-900">৳{order.total.toLocaleString()}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders today yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;