// Hybrid entity system - Supabase with mock data fallback
import {
  ProductEntity,
  BrandEntity,
  CategoryEntity,
  OrderEntity,
  UserEntity,
  DealerApplicationEntity,
  ShipmentEntity,
  SiteSettingsEntity,
  PageVisitEntity
} from './hybrid';

// Export entity instances (matching Base44 import pattern)
export const Product = ProductEntity;
export const Brand = BrandEntity;
export const Category = CategoryEntity;
export const Order = OrderEntity;
export const User = UserEntity;
export const DealerApplication = DealerApplicationEntity;
export const Shipment = ShipmentEntity;
export const SiteSettings = SiteSettingsEntity;
export const PageVisit = PageVisitEntity;

// Re-export types for convenience
export type {
  Product as ProductType,
  Brand as BrandType,
  Category as CategoryType,
  Order as OrderType,
  User as UserType,
  DealerApplication as DealerApplicationType,
  Shipment as ShipmentType,
  SiteSettings as SiteSettingsType,
  PageVisit as PageVisitType,
  CartItem
} from './types';