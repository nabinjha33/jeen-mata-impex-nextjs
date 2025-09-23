// Entity types based on Base44 schema definitions
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand: string;
  category: string;
  images?: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  created_date: string;
  updated_date: string;
  created_by?: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  packaging?: string;
  estimated_price_npr?: number;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-Order';
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  origin_country?: string;
  established_year?: string;
  specialty?: string;
  active: boolean;
  sort_order: number;
  created_date: string;
  updated_date: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  active: boolean;
  sort_order: number;
  created_date: string;
  updated_date: string;
}

export interface Order {
  id: string;
  dealer_email: string;
  order_number: string;
  product_items: OrderItem[];
  total_amount_npr: number;
  status: 'Submitted' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Archived';
  delivery_address?: string;
  notes?: string;
  created_date: string;
  updated_date: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image?: string;
  variant_id: string;
  variant_details: string;
  quantity: number;
  unit_price_npr: number;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  business_name?: string;
  vat_pan?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  business_type?: string;
  application_message?: string;
  dealer_status?: 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  created_date: string;
  updated_date?: string;
}

export interface DealerApplication {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  business_type: string;
  vat_pan: string;
  whatsapp?: string;
  application_message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_date: string;
  updated_date?: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  origin_country: 'China' | 'India';
  status: 'Booked' | 'In Transit' | 'At Port' | 'Customs' | 'In Warehouse';
  eta_date: string;
  product_names: string[];
  port_name?: string;
  last_updated: string;
  created_date: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  feature_flags?: Record<string, boolean>;
  created_date: string;
  updated_date?: string;
}

export interface PageVisit {
  id: string;
  path: string;
  page: string;
  user_email?: string;
  user_agent: string;
  created_date: string;
}

// Cart item type for frontend
export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  note?: string;
}