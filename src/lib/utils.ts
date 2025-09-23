import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base44 page routing utilities (adapted for Next.js)
export function createPageUrl(pageName: string): string {
  const pageRoutes: Record<string, string> = {
    // Public routes
    'Home': '/',
    'Products': '/products',
    'ProductDetail': '/product',
    'Brands': '/brands',
    'DealerLogin': '/dealer-login',
    'FastDrillBrand': '/brands/fastdrill',
    'SpiderBrand': '/brands/spider',
    'GorkhaBrand': '/brands/gorkha',
    'GeneralImportsBrand': '/brands/general-imports',
    
    // Dealer routes
    'DealerCatalog': '/dealer/catalog',
    'MyOrders': '/dealer/orders',
    'OrderCart': '/dealer/cart',
    'Shipments': '/dealer/shipments',
    'DealerProfile': '/dealer/profile',
    
    // Admin routes
    'AdminDashboard': '/admin/dashboard',
    'AdminProducts': '/admin/products',
    'AdminBrands': '/admin/brands',
    'AdminCategories': '/admin/categories',
    'AdminOrders': '/admin/orders',
    'AdminDealers': '/admin/dealers',
    'AdminShipments': '/admin/shipments',
    'AdminUsers': '/admin/users',
    'AdminSettings': '/admin/settings',
    'AdminBulkUpload': '/admin/bulk-upload'
  };
  
  return pageRoutes[pageName] || '/';
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: 'NPR'
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}