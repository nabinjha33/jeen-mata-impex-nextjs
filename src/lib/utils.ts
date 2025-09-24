import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Page URL mapping for Next.js routing
const pageRoutes: Record<string, string> = {
  // Public pages
  'Home': '/',
  'Products': '/products',
  'Brands': '/brands',
  'ProductDetail': '/product',
  'DealerLogin': '/dealer-login',
  
  // Brand pages
  'FastDrillBrand': '/brands/fastdrill',
  'SpiderBrand': '/brands/spider',
  'GorkhaBrand': '/brands/gorkha',
  'GeneralImportsBrand': '/brands/general-imports',
  
  // Dealer pages
  'DealerCatalog': '/dealer/catalog',
  'MyOrders': '/dealer/my-orders',
  'OrderCart': '/dealer/order-cart',
  'Shipments': '/dealer/shipments',
  'DealerProfile': '/dealer/profile',
  
  // Admin pages
  'AdminDashboard': '/admin/dashboard',
  'AdminOrders': '/admin/orders',
  'AdminProducts': '/admin/products',
  'AdminBrands': '/admin/brands',
  'AdminCategories': '/admin/categories',
  'AdminDealers': '/admin/dealers',
  'AdminUsers': '/admin/users',
  'AdminShipments': '/admin/shipments',
  'AdminSettings': '/admin/settings',
  'AdminBulkUpload': '/admin/bulk-upload'
};

export function createPageUrl(pageName: string): string {
  return pageRoutes[pageName] || '/';
}
