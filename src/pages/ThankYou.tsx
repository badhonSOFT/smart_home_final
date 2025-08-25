import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  category: string;
}

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        setOrderData(JSON.parse(decodeURIComponent(data)));
      } catch (err) {
        console.error('Failed to parse order data:', err);
      }
    }
  }, [searchParams]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        {/* Success Header */}
        <div className="text-center mb-8 mt-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Order Details */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Order Details</h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono font-bold">{orderData.order_number || '#10001'}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {orderData.customer_name}</p>
                <p><strong>Email:</strong> {orderData.customer_email}</p>
                <p><strong>Phone:</strong> {orderData.customer_phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h3>
              <p className="text-sm text-gray-600">{orderData.customer_address}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {orderData.payment_method === 'free' ? 'Free Service' : 
               orderData.payment_method === 'cod' ? 'Cash on Delivery' : 
               'Online Payment'}
            </p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderData.items.map((item: OrderItem, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">৳{item.price.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                {orderData.total_amount > 0 ? `৳${orderData.total_amount.toLocaleString()}` : 'FREE'}
              </span>
            </div>
          </div>
        </Card>



        {/* Actions */}
        <div className="text-center space-x-4">
          <Link to="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link to="/track-order">
            <Button>Track Order</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThankYou;