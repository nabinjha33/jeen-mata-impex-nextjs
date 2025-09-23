-- Create tables based on Base44 entity schemas
-- Execute this in your Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[],
  variants JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo TEXT,
  origin_country TEXT,
  established_year TEXT,
  specialty TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dealer_email TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  product_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount_npr DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Archived')),
  delivery_address TEXT,
  notes TEXT,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Dealer Applications table
CREATE TABLE IF NOT EXISTS dealer_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  business_type TEXT NOT NULL,
  vat_pan TEXT NOT NULL,
  whatsapp TEXT,
  application_message TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  origin_country TEXT NOT NULL CHECK (origin_country IN ('China', 'India')),
  status TEXT NOT NULL CHECK (status IN ('Booked', 'In Transit', 'At Port', 'Customs', 'In Warehouse')),
  eta_date DATE NOT NULL,
  product_names TEXT[] NOT NULL,
  port_name TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_address TEXT NOT NULL,
  feature_flags JSONB DEFAULT '{}'::jsonb,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- Page Visits table for analytics
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  page TEXT NOT NULL,
  user_email TEXT,
  user_agent TEXT NOT NULL,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_date
CREATE TRIGGER update_products_updated_date BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
CREATE TRIGGER update_brands_updated_date BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
CREATE TRIGGER update_categories_updated_date BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
CREATE TRIGGER update_orders_updated_date BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
CREATE TRIGGER update_dealer_applications_updated_date BEFORE UPDATE ON dealer_applications FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
CREATE TRIGGER update_site_settings_updated_date BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

-- Insert sample data
INSERT INTO site_settings (company_name, tagline, contact_email, contact_phone, contact_address, feature_flags) VALUES
('Jeen Mata Impex', 'Premium Import Solutions', 'jeenmataimpex8@gmail.com', '+977-1-XXXXXXX', 'Kathmandu, Nepal', 
 '{"whatsapp_notifications": true, "dealer_self_registration": true, "bulk_product_upload": true, "advanced_analytics": false}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert sample brands
INSERT INTO brands (name, slug, description, logo, origin_country, established_year, specialty, active, sort_order) VALUES
('FastDrill', 'fastdrill', 'Leading manufacturer of professional power tools and drilling equipment', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200', 'China', '1995', 'Power Tools & Drilling Equipment', true, 1),
('Spider', 'spider', 'Heavy-duty industrial tools for professional construction and manufacturing', 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=200', 'China', '1988', 'Industrial Power Tools', true, 2),
('Gorkha', 'gorkha', 'Traditional craftsmanship meets modern engineering in premium tool manufacturing', 'https://images.unsplash.com/photo-1589561084283-930aa7b62678?w=200', 'India', '1975', 'Hand Tools & Traditional Equipment', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color, active, sort_order) VALUES
('Power Tools', 'power-tools', 'Electric and battery-powered tools for professional and DIY use', 'Zap', '#3B82F6', true, 1),
('Hand Tools', 'hand-tools', 'Manual tools for precision work and traditional craftsmanship', 'Wrench', '#EF4444', true, 2),
('Safety Equipment', 'safety-equipment', 'Personal protective equipment and workplace safety gear', 'Shield', '#10B981', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, brand, category, images, variants, featured) VALUES
('FastDrill Professional 18V Cordless Drill', 'fastdrill-professional-18v-cordless-drill', 
 'High-performance cordless drill with advanced lithium-ion battery technology. Perfect for professional construction and home improvement projects.',
 'FastDrill', 'Power Tools', 
 ARRAY['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500'],
 '[{"id": "var_001_1", "size": "18V Basic", "packaging": "Tool Only", "estimated_price_npr": 15000, "stock_status": "In Stock"}, 
   {"id": "var_001_2", "size": "18V Pro", "packaging": "Kit with 2 Batteries", "estimated_price_npr": 25000, "stock_status": "In Stock"}, 
   {"id": "var_001_3", "size": "18V Max", "packaging": "Complete Set with Case", "estimated_price_npr": 35000, "stock_status": "Low Stock"}]'::jsonb,
 true),
('Spider Heavy Duty Angle Grinder', 'spider-heavy-duty-angle-grinder',
 'Industrial-grade angle grinder designed for heavy-duty cutting and grinding applications. Built to withstand continuous professional use.',
 'Spider', 'Power Tools',
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
 '[{"id": "var_002_1", "size": "4 inch (100mm)", "packaging": "Standard Box", "estimated_price_npr": 8500, "stock_status": "In Stock"}, 
   {"id": "var_002_2", "size": "5 inch (125mm)", "packaging": "Standard Box", "estimated_price_npr": 12000, "stock_status": "In Stock"}]'::jsonb,
 false),
('Gorkha Premium Tool Kit', 'gorkha-premium-tool-kit',
 'Comprehensive tool kit containing essential hand tools for professional tradespeople and serious DIY enthusiasts. Made with traditional craftsmanship.',
 'Gorkha', 'Hand Tools',
 ARRAY['https://images.unsplash.com/photo-1606086041992-8b7c3c6b2e07?w=500', 'https://images.unsplash.com/photo-1609205250516-4c225cd4ef26?w=500'],
 '[{"id": "var_003_1", "size": "50-piece Set", "packaging": "Metal Toolbox", "estimated_price_npr": 18000, "stock_status": "In Stock"}, 
   {"id": "var_003_2", "size": "100-piece Set", "packaging": "Rolling Toolbox", "estimated_price_npr": 32000, "stock_status": "Pre-Order"}]'::jsonb,
 true)
ON CONFLICT (slug) DO NOTHING;