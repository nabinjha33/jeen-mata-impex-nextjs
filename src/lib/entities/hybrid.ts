// Hybrid entity system - tries Supabase first, falls back to mock data
import { supabase } from '@/lib/supabase';
import {
  mockProducts, mockBrands, mockCategories, mockOrders,
  mockUsers, mockShipments, mockDealerApplications, mockSiteSettings
} from './mockData';
import type { 
  Product, Brand, Category, Order, User, DealerApplication, 
  Shipment, SiteSettings, PageVisit 
} from './types';

// Check if Supabase tables exist
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('id').limit(1);
    return !error;
  } catch (error) {
    return false;
  }
}

// Hybrid entity class that uses Supabase or falls back to mock data
class HybridEntity<T extends { id: string; created_date: string; updated_date?: string }> {
  private mockData: T[];
  
  constructor(private tableName: string, mockData: T[]) {
    this.mockData = [...mockData];
  }

  async list(sort?: string, limit?: number): Promise<T[]> {
    try {
      // Try Supabase first
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
        // Fall back to mock data
        console.warn(`Using mock data for ${this.tableName} - database not ready`);
        return this.getMockData(sort, limit);
      }
      
      return data || [];
    } catch (error) {
      // Fall back to mock data
      console.warn(`Using mock data for ${this.tableName} - database not ready`);
      return this.getMockData(sort, limit);
    }
  }

  async filter(filters: Record<string, any>, sort?: string, limit?: number): Promise<T[]> {
    try {
      // Try Supabase first
      let query = supabase.from(this.tableName).select('*');
      
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
        // Fall back to mock data with filters
        console.warn(`Using filtered mock data for ${this.tableName} - database not ready`);
        return this.getFilteredMockData(filters, sort, limit);
      }
      
      return data || [];
    } catch (error) {
      // Fall back to mock data with filters
      console.warn(`Using filtered mock data for ${this.tableName} - database not ready`);
      return this.getFilteredMockData(filters, sort, limit);
    }
  }

  async create(entityData: Omit<T, 'id' | 'created_date' | 'updated_date'>): Promise<T> {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([entityData])
        .select()
        .single();
      
      if (error) {
        // Fall back to mock creation
        console.warn(`Using mock creation for ${this.tableName} - database not ready`);
        return this.createMockEntity(entityData);
      }
      
      return data;
    } catch (error) {
      // Fall back to mock creation
      console.warn(`Using mock creation for ${this.tableName} - database not ready`);
      return this.createMockEntity(entityData);
    }
  }

  // Helper methods for mock data operations
  private getMockData(sort?: string, limit?: number): T[] {
    let result = [...this.mockData];
    
    if (sort) {
      const [field, direction] = sort.startsWith('-') ? [sort.slice(1), 'desc'] : [sort, 'asc'];
      result.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        
        if (direction === 'desc') {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    if (limit) {
      result = result.slice(0, limit);
    }
    
    return result;
  }

  private getFilteredMockData(filters: Record<string, any>, sort?: string, limit?: number): T[] {
    let result = this.mockData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        return (item as any)[key] === value;
      });
    });

    if (sort) {
      const [field, direction] = sort.startsWith('-') ? [sort.slice(1), 'desc'] : [sort, 'asc'];
      result.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        
        if (direction === 'desc') {
          return aVal < bVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }
    
    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }

  private createMockEntity(entityData: Omit<T, 'id' | 'created_date' | 'updated_date'>): T {
    const now = new Date().toISOString();
    const newEntity = {
      ...entityData,
      id: `${this.tableName.toLowerCase()}_${Date.now()}`,
      created_date: now,
      updated_date: now
    } as T;

    this.mockData.push(newEntity);
    return newEntity;
  }

  // Standard methods (simplified for hybrid mode)
  async update(id: string, updates: Partial<T>): Promise<T> {
    // For now, return mock data - would implement real Supabase update
    const item = this.mockData.find(item => item.id === id);
    if (!item) throw new Error(`${this.tableName} not found`);
    return item;
  }

  async delete(id: string): Promise<void> {
    // For now, do nothing - would implement real Supabase delete
    console.warn('Delete operation not implemented in hybrid mode');
  }

  async bulkCreate(entities: Omit<T, 'id' | 'created_date' | 'updated_date'>[]): Promise<T[]> {
    // For now, return mock data - would implement real Supabase bulk create
    return entities.map(entity => this.createMockEntity(entity));
  }

  schema(): any {
    return { name: this.tableName, type: 'object', properties: {} };
  }
}

// User entity with special methods
class HybridUserEntity extends HybridEntity<User> {
  constructor() {
    super('users', mockUsers);
  }

  async me(): Promise<User> {
    // Always throw auth error for public pages - this is expected
    throw new Error('User not authenticated');
  }

  async updateMyUserData(userData: Partial<User>): Promise<User> {
    const currentUser = await this.me();
    return this.update(currentUser.id, userData);
  }

  login(): void {
    console.log('Redirecting to login...');
  }

  logout(): void {
    console.log('Logging out...');
  }
}

// Site Settings entity
class HybridSiteSettingsEntity extends HybridEntity<SiteSettings> {
  constructor() {
    super('site_settings', [mockSiteSettings]);
  }

  async list(): Promise<SiteSettings[]> {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1);
      
      if (error || !data || data.length === 0) {
        console.warn('Using mock site settings - database not ready');
        return [mockSiteSettings];
      }
      
      return data;
    } catch (error) {
      console.warn('Using mock site settings - database not ready');
      return [mockSiteSettings];
    }
  }
}

// Page Visit entity for analytics
class HybridPageVisitEntity extends HybridEntity<PageVisit> {
  private visits: PageVisit[] = [];
  
  constructor() {
    super('page_visits', []);
  }

  async create(visitData: Omit<PageVisit, 'id' | 'created_date'>): Promise<PageVisit> {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('page_visits')
        .insert([visitData])
        .select()
        .single();
      
      if (error) {
        // Fall back to local storage
        const visit: PageVisit = {
          ...visitData,
          id: `visit_${Date.now()}`,
          created_date: new Date().toISOString()
        };
        this.visits.push(visit);
        return visit;
      }
      
      return data;
    } catch (error) {
      // Fall back to local storage
      const visit: PageVisit = {
        ...visitData,
        id: `visit_${Date.now()}`,
        created_date: new Date().toISOString()
      };
      this.visits.push(visit);
      return visit;
    }
  }
}

// Export hybrid entity instances
export const ProductEntity = new HybridEntity<Product>('products', mockProducts);
export const BrandEntity = new HybridEntity<Brand>('brands', mockBrands);
export const CategoryEntity = new HybridEntity<Category>('categories', mockCategories);
export const OrderEntity = new HybridEntity<Order>('orders', mockOrders);
export const UserEntity = new HybridUserEntity();
export const DealerApplicationEntity = new HybridEntity<DealerApplication>('dealer_applications', mockDealerApplications);
export const ShipmentEntity = new HybridEntity<Shipment>('shipments', mockShipments);
export const SiteSettingsEntity = new HybridSiteSettingsEntity();
export const PageVisitEntity = new HybridPageVisitEntity();