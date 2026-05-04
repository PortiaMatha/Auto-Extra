import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Customer, Order, OrderItem, OrderStatus } from '../types/orders';

/* ── Raw DB row types ─────────────────────────────────────────────── */

interface CustomerRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  created_at: string;
}

interface OrderRow {
  id: number;
  order_ref: string;
  customer_id: number | null;
  status: string;
  total_amount: number;
  shipping_fee: number;
  notes: string;
  created_at: string;
  customers: { full_name: string; email: string } | null;
  order_items: {
    id: number;
    product_id: number | null;
    quantity: number;
    unit_price: number;
    size: string;
    color: string;
    material: string;
    products: { title: string } | null;
  }[];
}

/* ── Mappers ──────────────────────────────────────────────────────── */

function rowToCustomer(r: CustomerRow): Customer {
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    address: r.address,
    city: r.city,
    province: r.province,
    postalCode: r.postal_code,
    createdAt: r.created_at,
  };
}

function rowToOrder(r: OrderRow): Order {
  const items: OrderItem[] = (r.order_items ?? []).map(i => ({
    id: i.id,
    orderId: r.id,
    productId: i.product_id,
    productTitle: i.products?.title ?? 'Deleted product',
    quantity: i.quantity,
    unitPrice: i.unit_price,
    size: i.size,
    color: i.color,
    material: i.material,
  }));

  return {
    id: r.id,
    orderRef: r.order_ref,
    customerId: r.customer_id,
    customerName: r.customers?.full_name ?? 'Unknown',
    customerEmail: r.customers?.email ?? '',
    status: r.status as OrderStatus,
    totalAmount: r.total_amount,
    shippingFee: r.shipping_fee,
    notes: r.notes,
    createdAt: r.created_at,
    items,
  };
}

/* ── Context ──────────────────────────────────────────────────────── */

interface OrdersContextType {
  orders: Order[];
  customers: Customer[];
  loading: boolean;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      const [ordersRes, customersRes] = await Promise.all([
        supabase
          .from('orders')
          .select(`
            *,
            customers ( full_name, email ),
            order_items (
              id, product_id, quantity, unit_price, size, color, material,
              products ( title )
            )
          `)
          .order('created_at', { ascending: false }),

        supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (ordersRes.error) console.error('Failed to load orders:', ordersRes.error.message);
      else setOrders((ordersRes.data as OrderRow[]).map(rowToOrder));

      if (customersRes.error) console.error('Failed to load customers:', customersRes.error.message);
      else setCustomers((customersRes.data as CustomerRow[]).map(rowToCustomer));

      setLoading(false);
    }

    fetchAll();
  }, []);

  /* ── Real-time subscription for orders ── */
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        // Re-fetch on any order change to get fresh joined data
        supabase
          .from('orders')
          .select(`
            *,
            customers ( full_name, email ),
            order_items (
              id, product_id, quantity, unit_price, size, color, material,
              products ( title )
            )
          `)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data) setOrders((data as OrderRow[]).map(rowToOrder));
          });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) { console.error('Failed to update order:', error.message); throw error; }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = async (id: number) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) { console.error('Failed to delete order:', error.message); throw error; }
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        full_name:   customer.fullName,
        email:       customer.email,
        phone:       customer.phone,
        address:     customer.address,
        city:        customer.city,
        province:    customer.province,
        postal_code: customer.postalCode,
      })
      .select()
      .single();

    if (error) { console.error('Failed to add customer:', error.message); throw error; }
    const newCustomer = rowToCustomer(data as CustomerRow);
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  return (
    <OrdersContext.Provider value={{ orders, customers, loading, updateOrderStatus, deleteOrder, addCustomer }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
}
