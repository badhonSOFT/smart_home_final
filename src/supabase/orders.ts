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
    // Save customer data first
    await customerService.createOrUpdateCustomer({
      name: orderData.customer_name,
      email: orderData.customer_email,
      phone: orderData.customer_phone,
      address: orderData.customer_address,
      total_spent: orderData.total_amount
    });

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data;
  },

  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
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
      console.error('Error updating order status:', error);
      throw error;
    }

    return data;
  },

  async searchOrders(query: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_number.eq.${query},customer_phone.eq.${query}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching orders:', error);
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
      console.error('Error deleting order:', error);
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
      console.error('Error updating order:', error);
      throw error;
    }

    return data;
  }
};