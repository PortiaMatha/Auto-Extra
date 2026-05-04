export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number | null;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  size: string;
  color: string;
  material: string;
}

export interface Order {
  id: number;
  orderRef: string;
  customerId: number | null;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  notes: string;
  createdAt: string;
  items: OrderItem[];
}
