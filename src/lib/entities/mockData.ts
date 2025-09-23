import { Product, Brand, Category, Order, User, DealerApplication, Shipment, SiteSettings } from './types';

// Sample data based on Base44 fixture data
export const mockProducts: Product[] = [
  {
    id: "prod_001",
    name: "FastDrill Professional 18V Cordless Drill",
    slug: "fastdrill-professional-18v-cordless-drill",
    description: "High-performance cordless drill with advanced lithium-ion battery technology. Perfect for professional construction and home improvement projects.",
    brand: "FastDrill",
    category: "Power Tools",
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500",
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500"
    ],
    variants: [
      {
        id: "var_001_1",
        size: "18V Basic",
        packaging: "Tool Only",
        estimated_price_npr: 15000,
        stock_status: "In Stock"
      },
      {
        id: "var_001_2", 
        size: "18V Pro",
        packaging: "Kit with 2 Batteries",
        estimated_price_npr: 25000,
        stock_status: "In Stock"
      },
      {
        id: "var_001_3",
        size: "18V Max",
        packaging: "Complete Set with Case",
        estimated_price_npr: 35000,
        stock_status: "Low Stock"
      }
    ],
    featured: true,
    created_date: "2024-01-15T10:30:00Z",
    updated_date: "2024-01-20T14:15:00Z"
  },
  {
    id: "prod_002",
    name: "Spider Heavy Duty Angle Grinder",
    slug: "spider-heavy-duty-angle-grinder",
    description: "Industrial-grade angle grinder designed for heavy-duty cutting and grinding applications. Built to withstand continuous professional use.",
    brand: "Spider", 
    category: "Power Tools",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
    ],
    variants: [
      {
        id: "var_002_1",
        size: "4 inch (100mm)",
        packaging: "Standard Box",
        estimated_price_npr: 8500,
        stock_status: "In Stock"
      },
      {
        id: "var_002_2",
        size: "5 inch (125mm)",
        packaging: "Standard Box", 
        estimated_price_npr: 12000,
        stock_status: "In Stock"
      }
    ],
    featured: false,
    created_date: "2024-01-10T09:20:00Z",
    updated_date: "2024-01-18T11:45:00Z"
  },
  {
    id: "prod_003",
    name: "Gorkha Premium Tool Kit",
    slug: "gorkha-premium-tool-kit",
    description: "Comprehensive tool kit containing essential hand tools for professional tradespeople and serious DIY enthusiasts. Made with traditional craftsmanship.",
    brand: "Gorkha",
    category: "Hand Tools",
    images: [
      "https://images.unsplash.com/photo-1606086041992-8b7c3c6b2e07?w=500",
      "https://images.unsplash.com/photo-1609205250516-4c225cd4ef26?w=500"
    ],
    variants: [
      {
        id: "var_003_1",
        size: "50-piece Set",
        packaging: "Metal Toolbox",
        estimated_price_npr: 18000,
        stock_status: "In Stock"
      },
      {
        id: "var_003_2",
        size: "100-piece Set",
        packaging: "Rolling Toolbox",
        estimated_price_npr: 32000,
        stock_status: "Pre-Order"
      }
    ],
    featured: true,
    created_date: "2024-01-12T15:45:00Z",
    updated_date: "2024-01-22T10:30:00Z"
  }
];

export const mockBrands: Brand[] = [
  {
    id: "brand_001",
    name: "FastDrill",
    slug: "fastdrill",
    description: "Leading manufacturer of professional power tools and drilling equipment",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200",
    origin_country: "China",
    established_year: "1995",
    specialty: "Power Tools & Drilling Equipment",
    active: true,
    sort_order: 1,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-01T00:00:00Z"
  },
  {
    id: "brand_002", 
    name: "Spider",
    slug: "spider",
    description: "Heavy-duty industrial tools for professional construction and manufacturing",
    logo: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200",
    origin_country: "China",
    established_year: "1988",
    specialty: "Industrial Power Tools",
    active: true,
    sort_order: 2,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-01T00:00:00Z"
  },
  {
    id: "brand_003",
    name: "Gorkha", 
    slug: "gorkha",
    description: "Traditional craftsmanship meets modern engineering in premium tool manufacturing",
    logo: "https://images.unsplash.com/photo-1589561084283-930aa7b62678?w=200",
    origin_country: "India",
    established_year: "1975",
    specialty: "Hand Tools & Traditional Equipment",
    active: true,
    sort_order: 3,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-01T00:00:00Z"
  }
];

export const mockCategories: Category[] = [
  {
    id: "cat_001",
    name: "Power Tools",
    slug: "power-tools",
    description: "Electric and battery-powered tools for professional and DIY use",
    icon: "Zap",
    color: "#3B82F6",
    active: true,
    sort_order: 1,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-01T00:00:00Z"
  },
  {
    id: "cat_002",
    name: "Hand Tools", 
    slug: "hand-tools",
    description: "Manual tools for precision work and traditional craftsmanship",
    icon: "Wrench",
    color: "#EF4444",
    active: true,
    sort_order: 2,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-01T00:00:00Z"
  },
  {
    id: "cat_003",
    name: "Safety Equipment",
    slug: "safety-equipment", 
    description: "Personal protective equipment and workplace safety gear",
    icon: "Shield",
    color: "#10B981",
    active: true,
    sort_order: 3,
    created_date: "2024-01-01T00:00:00Z",
    updated_date: "2024-01-01T00:00:00Z"
  }
];

export const mockSiteSettings: SiteSettings = {
  id: "settings_001",
  company_name: "Jeen Mata Impex",
  tagline: "Premium Import Solutions",
  contact_email: "jeenmataimpex8@gmail.com",
  contact_phone: "+977-1-XXXXXXX",
  contact_address: "Kathmandu, Nepal",
  feature_flags: {
    whatsapp_notifications: true,
    dealer_self_registration: true,
    bulk_product_upload: true,
    advanced_analytics: false
  },
  created_date: "2024-01-01T00:00:00Z",
  updated_date: "2024-01-01T00:00:00Z"
};

export const mockUsers: User[] = [
  {
    id: "user_001",
    email: "admin@jeenmataimpex.com",
    full_name: "Admin User",
    role: "admin",
    created_date: "2024-01-01T00:00:00Z"
  },
  {
    id: "user_002", 
    email: "abc.hardware@gmail.com",
    full_name: "Ram Sharma",
    role: "user",
    business_name: "ABC Hardware Store",
    vat_pan: "123456789",
    address: "Thamel, Kathmandu, Nepal",
    phone: "+977-1-4567890",
    whatsapp: "+977-9851234567",
    business_type: "Hardware Retail",
    dealer_status: "Approved",
    created_date: "2024-01-10T10:30:00Z"
  }
];

export const mockOrders: Order[] = [
  {
    id: "order_001",
    dealer_email: "abc.hardware@gmail.com",
    order_number: "JMI-1705123456789",
    product_items: [
      {
        product_id: "prod_001",
        product_name: "FastDrill Professional 18V Cordless Drill",
        product_image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500",
        variant_id: "var_001_2",
        variant_details: "18V Pro - Kit with 2 Batteries",
        quantity: 3,
        unit_price_npr: 25000,
        notes: "Please include extra charger if available"
      },
      {
        product_id: "prod_002", 
        product_name: "Spider Heavy Duty Angle Grinder",
        product_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        variant_id: "var_002_1",
        variant_details: "4 inch (100mm) - Standard Box",
        quantity: 5,
        unit_price_npr: 8500,
        notes: "Need these for upcoming project"
      }
    ],
    total_amount_npr: 117500,
    status: "Confirmed",
    delivery_address: "Hardware Store, Thamel, Kathmandu",
    notes: "Regular customer - priority delivery requested",
    created_date: "2024-01-20T09:15:00Z",
    updated_date: "2024-01-21T14:30:00Z"
  }
];

export const mockShipments: Shipment[] = [
  {
    id: "ship_001",
    tracking_number: "JMISHIP2024001",
    origin_country: "China",
    status: "In Transit",
    eta_date: "2024-02-15",
    product_names: [
      "FastDrill Professional 18V Cordless Drill",
      "Spider Heavy Duty Angle Grinder",
      "Various Power Tool Accessories"
    ],
    port_name: "Kolkata Port",
    last_updated: "2024-01-25T08:30:00Z",
    created_date: "2024-01-20T10:00:00Z"
  },
  {
    id: "ship_002",
    tracking_number: "JMISHIP2024002", 
    origin_country: "India",
    status: "Customs",
    eta_date: "2024-02-05",
    product_names: [
      "Gorkha Premium Tool Kit",
      "Traditional Hand Tools",
      "Metal Working Tools"
    ],
    port_name: "Birgunj Border",
    last_updated: "2024-01-28T14:15:00Z",
    created_date: "2024-01-15T12:30:00Z"
  }
];

export const mockDealerApplications: DealerApplication[] = [
  {
    id: "app_001",
    business_name: "ABC Hardware Store",
    contact_person: "Ram Sharma",
    email: "abc.hardware@gmail.com",
    phone: "+977-1-4567890",
    address: "Thamel, Kathmandu, Nepal",
    business_type: "Hardware Retail",
    vat_pan: "123456789",
    whatsapp: "+977-9851234567",
    application_message: "We are an established hardware store with 10 years of experience. Looking to expand our power tools inventory.",
    status: "Approved",
    created_date: "2024-01-10T10:30:00Z"
  },
  {
    id: "app_002",
    business_name: "Professional Tools Merchant",
    contact_person: "Sita Patel",
    email: "tools.merchant@outlook.com",
    phone: "+977-1-9876543",
    address: "New Road, Pokhara, Nepal", 
    business_type: "Wholesale Distribution",
    vat_pan: "987654321",
    whatsapp: "+977-9849876543",
    application_message: "We distribute tools to contractors and builders in Pokhara region. Need access to quality imported tools.",
    status: "Pending",
    created_date: "2024-01-25T14:15:00Z"
  }
];