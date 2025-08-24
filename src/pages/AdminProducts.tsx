import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Upload } from 'lucide-react';
import AdminNavbar from '@/components/AdminNavbar';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const categories = ['All', 'Smart Switch', 'Smart Curtain', 'Security', 'Film'];

  const products = [
    {
      id: 'sw1',
      name: 'Zemismart Tuya 2 Gang',
      category: 'Smart Switch',
      price: '৳3,500',
      stock: 25,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 'sw2',
      name: 'Zemismart Tuya 3 Gang',
      category: 'Smart Switch',
      price: '৳3,850',
      stock: 18,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 'sw3',
      name: 'Zemismart Zigbee 2 Gang',
      category: 'Smart Switch',
      price: '৳3,500',
      stock: 0,
      status: 'Out of Stock',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 'sw4',
      name: 'Zemismart 4 Gang',
      category: 'Smart Switch',
      price: '৳3,500',
      stock: 0,
      status: 'Out of Stock',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 'sw5',
      name: 'Sonoff 4-gang WiFi',
      category: 'Smart Switch',
      price: '৳2,199',
      stock: 12,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 'ct1',
      name: 'Smart Sliding Curtain',
      category: 'Smart Curtain',
      price: '৳36,000',
      stock: 8,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    },
    {
      id: 'ct2',
      name: 'Smart Roller Curtain',
      category: 'Smart Curtain',
      price: '৳13,000',
      stock: 15,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400'
    },
    {
      id: 'sc1',
      name: 'Sohub Protect SP 01',
      category: 'Security',
      price: '৳8,500',
      stock: 6,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
    },
    {
      id: 'sc2',
      name: 'Sohub Protect SP 05',
      category: 'Security',
      price: '৳12,500',
      stock: 4,
      status: 'Low Stock',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
    },
    {
      id: 'pdlc1',
      name: 'PDLC Smart Film',
      category: 'Film',
      price: '৳15,000',
      stock: 10,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    }
  ];

  const getStatusColor = (status: string, stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 3) return 'bg-orange-100 text-orange-800';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Bulk Import</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" placeholder="Enter product name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      <option value="">Select category</option>
                      <option value="Smart Switch">Smart Switch</option>
                      <option value="Smart Curtain">Smart Curtain</option>
                      <option value="Security">Security</option>
                      <option value="Film">Film</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (BDT)</Label>
                    <Input id="price" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Product description" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input id="image" type="file" accept="image/*" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Search and Filter */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                .filter(product => 
                  selectedCategory === 'All' || product.category === selectedCategory
                )
                .filter(product => 
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-semibold">{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status, product.stock)}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock <= 3 ? 'Low Stock' : product.stock <= 10 ? 'Medium' : 'In Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default AdminProducts;