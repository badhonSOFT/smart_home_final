import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Eye } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = [
    {
      id: 'CUST-001',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+880 1712-345678',
      totalOrders: 5,
      totalSpent: '৳4,250',
      lastOrder: '2024-12-15',
      status: 'Active'
    },
    {
      id: 'CUST-002',
      name: 'Fatima Khan',
      email: 'fatima@example.com',
      phone: '+880 1798-765432',
      totalOrders: 2,
      totalSpent: '৳1,080',
      lastOrder: '2024-12-14',
      status: 'Active'
    },
    {
      id: 'CUST-003',
      name: 'Rashid Ali',
      email: 'rashid@example.com',
      phone: '+880 1555-123456',
      totalOrders: 8,
      totalSpent: '৳9,600',
      lastOrder: '2024-12-13',
      status: 'VIP'
    },
  ];

  const customerOrders = [
    { id: 'ORD-001', date: '2024-12-15', total: '৳850', status: 'Delivered' },
    { id: 'ORD-005', date: '2024-12-10', total: '৳1,200', status: 'Delivered' },
    { id: 'ORD-012', date: '2024-12-05', total: '৳2,200', status: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customers</h1>

        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Customers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell className="font-semibold">{customer.totalSpent}</TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customer Profile - {customer.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium text-gray-900">Contact Information</h3>
                              <p className="text-sm text-gray-600">{customer.email}</p>
                              <p className="text-sm text-gray-600">{customer.phone}</p>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Order Summary</h3>
                              <p className="text-sm text-gray-600">Total Orders: {customer.totalOrders}</p>
                              <p className="text-sm text-gray-600">Total Spent: {customer.totalSpent}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-3">Order History</h3>
                            <div className="space-y-2">
                              {customerOrders.map((order) => (
                                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <span className="font-medium">{order.id}</span>
                                    <span className="text-sm text-gray-500 ml-2">{order.date}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold">{order.total}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default AdminCustomers;