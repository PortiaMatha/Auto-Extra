/* ─────────────────────────────────────────────────────────────────
   Portal API endpoints
   All paths are relative to REACT_APP_API_URL.
   ───────────────────────────────────────────────────────────────── */
import { api } from './client';
import type {
  AuthResponse, Order, PortalProduct, Category, ReturnItem,
  Shipment, Invoice, SaleEntry, Review, AnalyticsData,
  DashboardStats, SupplierSettings,
} from './types';

/* ── Auth ─────────────────────────────────────────────────────── */
export const authApi = {
  register: (body: { businessName: string; email: string; plan: string; [k: string]: string }) =>
    api.post<AuthResponse>('/api/auth/supplier/register', body),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/supplier/login', { email, password }),

  refresh: () =>
    api.post<{ token: string }>('/api/auth/supplier/refresh', {}),
};

/* ── Dashboard ────────────────────────────────────────────────── */
export const dashboardApi = {
  get: () => api.get<DashboardStats>('/api/portal/dashboard'),
};

/* ── Orders ───────────────────────────────────────────────────── */
export const ordersApi = {
  list:        ()                                    => api.get<Order[]>('/api/portal/orders'),
  get:         (id: string)                          => api.get<Order>(`/api/portal/orders/${id}`),
  updateStatus:(id: string, status: Order['status']) => api.patch<Order>(`/api/portal/orders/${id}`, { status }),
};

/* ── Products ─────────────────────────────────────────────────── */
export const productsApi = {
  list:   ()                           => api.get<PortalProduct[]>('/api/portal/products'),
  get:    (id: number)                 => api.get<PortalProduct>(`/api/portal/products/${id}`),
  create: (body: Omit<PortalProduct, 'id'>) => api.post<PortalProduct>('/api/portal/products', body),
  update: (id: number, body: Partial<PortalProduct>) => api.put<PortalProduct>(`/api/portal/products/${id}`, body),
  delete: (id: number)                 => api.delete<void>(`/api/portal/products/${id}`),
};

/* ── Categories ───────────────────────────────────────────────── */
export const categoriesApi = {
  list:   ()                               => api.get<Category[]>('/api/portal/categories'),
  create: (body: Omit<Category, 'id'>)     => api.post<Category>('/api/portal/categories', body),
  update: (id: number, body: Partial<Category>) => api.put<Category>(`/api/portal/categories/${id}`, body),
  delete: (id: number)                     => api.delete<void>(`/api/portal/categories/${id}`),
};

/* ── Returns ──────────────────────────────────────────────────── */
export const returnsApi = {
  list:         ()                                          => api.get<ReturnItem[]>('/api/portal/returns'),
  updateStatus: (id: string, status: ReturnItem['status']) => api.patch<ReturnItem>(`/api/portal/returns/${id}`, { status }),
};

/* ── Shipments ────────────────────────────────────────────────── */
export const shipmentsApi = {
  list: () => api.get<Shipment[]>('/api/portal/shipments'),
};

/* ── Invoices ─────────────────────────────────────────────────── */
export const invoicesApi = {
  list: () => api.get<Invoice[]>('/api/portal/invoices'),
};

/* ── Sales & Payouts ──────────────────────────────────────────── */
export const salesApi = {
  list: () => api.get<SaleEntry[]>('/api/portal/sales'),
};

/* ── Reviews ──────────────────────────────────────────────────── */
export const reviewsApi = {
  list:         ()                                          => api.get<Review[]>('/api/portal/reviews'),
  updateStatus: (id: number, status: Review['status'])     => api.patch<Review>(`/api/portal/reviews/${id}`, { status }),
  delete:       (id: number)                               => api.delete<void>(`/api/portal/reviews/${id}`),
};

/* ── Analytics ────────────────────────────────────────────────── */
export const analyticsApi = {
  get: () => api.get<AnalyticsData>('/api/portal/analytics'),
};

/* ── Settings ─────────────────────────────────────────────────── */
export const settingsApi = {
  get:    ()                           => api.get<SupplierSettings>('/api/portal/settings'),
  update: (body: Partial<SupplierSettings>) => api.put<SupplierSettings>('/api/portal/settings', body),
};
