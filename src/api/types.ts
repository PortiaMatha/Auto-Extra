/* ─────────────────────────────────────────────────────────────────
   Shared API types — mirror your backend response shapes here.
   ───────────────────────────────────────────────────────────────── */

/* ── Auth ── */
export interface AuthResponse {
  token: string;
  supplier: { id: string; name: string; email: string; plan: string };
}

/* ── Orders ── */
export type OrderStatus = 'Processing' | 'Delivered' | 'Pending' | 'Cancelled';

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

/* ── Products ── */
export type ProductStatus = 'Active' | 'Inactive';

export interface PortalProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string;
}

/* ── Categories ── */
export interface Category {
  id: number;
  name: string;
  slug: string;
  products: number;
  status: 'Active' | 'Draft';
}

/* ── Returns ── */
export type ReturnStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface ReturnItem {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  product: string;
  reason: string;
  date: string;
  status: ReturnStatus;
}

/* ── Shipments ── */
export type ShipStatus = 'In Transit' | 'Delivered' | 'Pending' | 'Failed';

export interface Shipment {
  tracking: string;
  orderId: string;
  customer: string;
  courier: string;
  destination: string;
  eta: string;
  status: ShipStatus;
}

/* ── Invoices ── */
export type InvStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  date: string;
  due: string;
  amount: number;
  status: InvStatus;
}

/* ── Sales & Payouts ── */
export type PayoutStatus = 'Paid' | 'Pending' | 'Processing';

export interface SaleEntry {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  fee: number;
  net: number;
  status: PayoutStatus;
}

/* ── Reviews ── */
export type ReviewStatus = 'Published' | 'Pending' | 'Flagged';

export interface Review {
  id: number;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

/* ── Analytics ── */
export interface AnalyticsStat {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string;
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  pct: number;
}

export interface AnalyticsData {
  stats: AnalyticsStat[];
  monthly: MonthlyDataPoint[];
  topProducts: TopProduct[];
}

/* ── Dashboard ── */
export interface DashboardDataPoint {
  day: string;
  value: number;
}

export interface DashboardOrder {
  id: string;
  customer: string;
  amount: string;
  status: OrderStatus;
  time: string;
}

export interface DashboardStats {
  salesData: DashboardDataPoint[];
  recentOrders: DashboardOrder[];
  totalSales: string;
  totalOrders: number;
  payoutBalance: string;
  activeProducts: number;
}

/* ── Settings ── */
export interface SupplierSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  plan: string;
  notifications: {
    orderEmails: boolean;
    marketingEmails: boolean;
    smsAlerts: boolean;
    weeklyReport: boolean;
  };
}

/* ── Pagination wrapper (optional) ── */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}
