import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Customer, Order, OrderItem, OrderStatus, PaymentStatus } from '../types/orders';

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
  payment_status: string;
  total_amount: number;
  shipping_fee: number;
  notes: string;
  phone: string;
  created_at: string;
  delivery_address: string;
  delivery_city: string;
  delivery_province: string;
  delivery_postal_code: string;
  delivery_country: string;
  billing_same: boolean;
  billing_first_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_province: string;
  billing_postal_code: string;
  billing_country: string;
  billing_phone: string;
  billing_alt_phone: string;
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
    phone: r.phone ?? '',
    status: r.status as OrderStatus,
    paymentStatus: (r.payment_status ?? 'Unpaid') as PaymentStatus,
    totalAmount: r.total_amount,
    shippingFee: r.shipping_fee,
    notes: r.notes ?? '',
    createdAt: r.created_at,
    deliveryAddress:    r.delivery_address ?? '',
    deliveryCity:       r.delivery_city ?? '',
    deliveryProvince:   r.delivery_province ?? '',
    deliveryPostalCode: r.delivery_postal_code ?? '',
    deliveryCountry:    r.delivery_country ?? 'South Africa',
    billingSame:        r.billing_same ?? true,
    billingFirstName:   r.billing_first_name ?? '',
    billingLastName:    r.billing_last_name ?? '',
    billingAddress:     r.billing_address ?? '',
    billingCity:        r.billing_city ?? '',
    billingProvince:    r.billing_province ?? '',
    billingPostalCode:  r.billing_postal_code ?? '',
    billingCountry:     r.billing_country ?? '',
    billingPhone:       r.billing_phone ?? '',
    billingAltPhone:    r.billing_alt_phone ?? '',
    items,
  };
}

/* ── Context ──────────────────────────────────────────────────────── */

export interface NewOrderData {
  orderRef: string;
  totalAmount: number;
  shippingFee: number;
  phone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryProvince: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  billingSame: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingProvince: string;
  billingPostalCode: string;
  billingCountry: string;
  billingPhone: string;
  billingAltPhone: string;
  items: { productId: number | null; productTitle: string; quantity: number; unitPrice: number }[];
}

interface OrdersContextType {
  orders: Order[];
  customers: Customer[];
  loading: boolean;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderRef: string, paymentStatus: PaymentStatus) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
  createOrder: (customer: Omit<Customer, 'id' | 'createdAt'>, order: NewOrderData) => Promise<string>;
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

  const createOrder = async (
    customerData: Omit<Customer, 'id' | 'createdAt'>,
    order: NewOrderData,
  ): Promise<string> => {
    // Upsert customer by email
    const { data: custData, error: custErr } = await supabase
      .from('customers')
      .upsert(
        {
          full_name:   customerData.fullName,
          email:       customerData.email,
          phone:       customerData.phone,
          address:     customerData.address,
          city:        customerData.city,
          province:    customerData.province,
          postal_code: customerData.postalCode,
        },
        { onConflict: 'email' },
      )
      .select()
      .single();

    if (custErr) { console.error('Failed to upsert customer:', custErr.message); throw custErr; }
    const customerId = (custData as CustomerRow).id;

    // Create order
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_ref:            order.orderRef,
        customer_id:          customerId,
        status:               'Pending',
        payment_status:       'Unpaid',
        total_amount:         order.totalAmount,
        shipping_fee:         order.shippingFee,
        notes:                '',
        phone:                order.phone,
        delivery_address:     order.deliveryAddress,
        delivery_city:        order.deliveryCity,
        delivery_province:    order.deliveryProvince,
        delivery_postal_code: order.deliveryPostalCode,
        delivery_country:     order.deliveryCountry,
        billing_same:         order.billingSame,
        billing_first_name:   order.billingFirstName,
        billing_last_name:    order.billingLastName,
        billing_address:      order.billingAddress,
        billing_city:         order.billingCity,
        billing_province:     order.billingProvince,
        billing_postal_code:  order.billingPostalCode,
        billing_country:      order.billingCountry,
        billing_phone:        order.billingPhone,
        billing_alt_phone:    order.billingAltPhone,
      })
      .select()
      .single();

    if (orderErr) { console.error('Failed to create order:', orderErr.message); throw orderErr; }
    const orderId = (orderData as { id: number }).id;

    // Insert order items
    if (order.items.length > 0) {
      const { error: itemsErr } = await supabase.from('order_items').insert(
        order.items.map(item => ({
          order_id:   orderId,
          product_id: item.productId,
          quantity:   item.quantity,
          unit_price: item.unitPrice,
          size: '', color: '', material: '',
        }))
      );
      if (itemsErr) console.error('Failed to insert order items:', itemsErr.message);
    }

    return order.orderRef;
  };

  const updatePaymentStatus = async (orderRef: string, paymentStatus: PaymentStatus) => {
    const newStatus = paymentStatus === 'Paid' ? 'Processing' : 'Pending';
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus, status: newStatus })
      .eq('order_ref', orderRef);

    if (error) { console.error('Failed to update payment status:', error.message); throw error; }
    setOrders(prev => prev.map(o =>
      o.orderRef === orderRef
        ? { ...o, paymentStatus, status: newStatus as OrderStatus }
        : o
    ));
  };

  return (
    <OrdersContext.Provider value={{ orders, customers, loading, updateOrderStatus, updatePaymentStatus, deleteOrder, addCustomer, createOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
}
