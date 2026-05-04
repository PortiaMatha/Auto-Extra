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

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Failed';

export interface Order {
  id: number;
  orderRef: string;
  customerId: number | null;
  customerName: string;
  customerEmail: string;
  phone: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingFee: number;
  notes: string;
  createdAt: string;
  // Delivery
  deliveryAddress: string;
  deliveryCity: string;
  deliveryProvince: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
  // Billing
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
  items: OrderItem[];
}
