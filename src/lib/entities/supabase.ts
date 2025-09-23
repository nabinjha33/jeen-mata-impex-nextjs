import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { 
  Product, Brand, Category, Order, User, DealerApplication, 
  Shipment, SiteSettings, PageVisit 
} from './types';

// Base entity class for Supabase operations
class SupabaseEntity<T extends { id: string; created_date: string; updated_date?: string }> {
  constructor(private tableName: string) {}

  // List all entities with optional sorting and limiting
  async list(sort?: string, limit?: number): Promise<T[]> {
    try {
      let query = supabase.from(this.tableName).select('*');
      
      if (sort) {
        const [field, direction] = sort.startsWith('-') ? [sort.slice(1), false] : [sort, true];
        query = query.order(field, { ascending: direction });
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        // If tables don't exist, return empty array gracefully
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          console.warn(`Table ${this.tableName} not found. Please run the SQL schema first.`);
          return [];
        }
        handleSupabaseError(error);
      }
      
      return data || [];
    } catch (error) {
      console.warn(`Failed to load ${this.tableName}:`, error);
      return [];
    }
  }

  // Filter entities
  async filter(filters: Record<string, any>, sort?: string, limit?: number): Promise<T[]> {
    try {
      let query = supabase.from(this.tableName).select('*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      if (sort) {
        const [field, direction] = sort.startsWith('-') ? [sort.slice(1), false] : [sort, true];
        query = query.order(field, { ascending: direction });
      }
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) {
        // If tables don't exist, return empty array gracefully
        if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
          console.warn(`Table ${this.tableName} not found. Please run the SQL schema first.`);
          return [];
        }
        handleSupabaseError(error);
      }
      
      return data || [];
    } catch (error) {
      console.warn(`Failed to filter ${this.tableName}:`, error);
      return [];
    }
  }

  // Create new entity
  async create(entityData: Omit<T, 'id' | 'created_date' | 'updated_date'>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([entityData])
      .select()
      .single();
    
    handleSupabaseError(error);
    return data;
  }

  // Update entity
  async update(id: string, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    handleSupabaseError(error);
    return data;
  }

  // Delete entity
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    handleSupabaseError(error);
  }

  // Bulk create
  async bulkCreate(entities: Omit<T, 'id' | 'created_date' | 'updated_date'>[]): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entities)
      .select();
    
    handleSupabaseError(error);
    return data || [];
  }

  // Get schema (mock for compatibility)
  schema(): Record<string, unknown> {
    return { name: this.tableName, type: 'object', properties: {} };
  }
}

// User entity with special methods for auth
class SupabaseUserEntity extends SupabaseEntity<User> {
  constructor() {
    super('users');
  }

  // Get current user (would integrate with Supabase Auth)
  async me(): Promise<User> {
    try {
      // For now, return mock admin - in real implementation would use supabase.auth.getUser()
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .limit(1);
      
      if (error) {
        // If tables don't exist yet, throw auth error gracefully
        throw new Error('User not authenticated');
      }
      
      if (!users || users.length === 0) {
        throw new Error('User not authenticated');
      }
      
      return users[0];
    } catch {
      // Graceful fallback when database isn't set up yet
      throw new Error('User not authenticated');
    }
  }

  // Update current user data
  async updateMyUserData(userData: Partial<User>): Promise<User> {
    const currentUser = await this.me();
    return this.update(currentUser.id, userData);
  }

  // Mock login
  login(): void {
    console.log('Redirecting to login...');
  }

  // Mock logout
  logout(): void {
    console.log('Logging out...');
  }
}

// SiteSettings entity with singleton behavior
class SupabaseSiteSettingsEntity extends SupabaseEntity<SiteSettings> {
  constructor() {
    super('site_settings');
  }

  async list(): Promise<SiteSettings[]> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);
    
    handleSupabaseError(error);
    return data || [];
  }
}

// PageVisit entity for analytics
class SupabasePageVisitEntity extends SupabaseEntity<PageVisit> {
  constructor() {
    super('page_visits');
  }

  async create(visitData: Omit<PageVisit, 'id' | 'created_date'>): Promise<PageVisit> {
    const { data, error } = await supabase
      .from('page_visits')
      .insert([visitData])
      .select()
      .single();
    
    handleSupabaseError(error);
    return data;
  }
}

// Export Supabase-based entity instances
export const ProductEntity = new SupabaseEntity<Product>('products');
export const BrandEntity = new SupabaseEntity<Brand>('brands');
export const CategoryEntity = new SupabaseEntity<Category>('categories');
export const OrderEntity = new SupabaseEntity<Order>('orders');
export const UserEntity = new SupabaseUserEntity();
export const DealerApplicationEntity = new SupabaseEntity<DealerApplication>('dealer_applications');
export const ShipmentEntity = new SupabaseEntity<Shipment>('shipments');
export const SiteSettingsEntity = new SupabaseSiteSettingsEntity();
export const PageVisitEntity = new SupabasePageVisitEntity();