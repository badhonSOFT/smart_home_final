import { supabase } from './client';
import { customerService } from './customers';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Order {
  id?: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: string;
  status: string;
  created_at?: string;
}

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status' | 'order_number'>) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          order_number: `ORD${Date.now()}`,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', JSON.stringify(error, null, 2));
        throw error;
      }

      // Try to save customer data (non-blocking)
      try {
        await customerService.createOrUpdateCustomer({
          name: orderData.customer_name,
          email: orderData.customer_email,
          phone: orderData.customer_phone,
          address: orderData.customer_address,
          total_spent: orderData.total_amount
        });
      } catch (customerError) {
        console.warn('Customer save failed, but order was created:', JSON.stringify(customerError, null, 2));
      }

      return data;
    } catch (error) {
      console.error('Order creation failed:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', JSON.stringify(error, null, 2));
      throw error;
    }

    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', JSON.stringify(error, null, 2));
      throw error;
    }

    return data;
  },

  async searchOrders(query: string) {
    // Sanitize input to prevent injection
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9+\-\s]/g, '');
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_number.ilike.%${sanitizedQuery}%,customer_phone.ilike.%${sanitizedQuery}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching orders:', JSON.stringify(error, null, 2));
      throw error;
    }

    return data;
  },

  async deleteOrder(orderId: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', JSON.stringify(error, null, 2));
      throw error;
    }

    return true;
  },

  async updateOrder(orderId: string, orderData: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', JSON.stringify(error, null, 2));
      throw error;
    }

    return data;
  }
};