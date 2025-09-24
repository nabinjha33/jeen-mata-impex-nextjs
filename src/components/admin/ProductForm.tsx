'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw } from 'lucide-react';
import ImageUploader from './ImageUploader';
import VariantManager from './VariantManager';

// TODO: Replace with actual entity imports
// import { Product } from '@/lib/entities/Product';
// import { Brand } from '@/lib/entities/Brand';
// import { Category } from '@/lib/entities/Category';

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  images: string[];
  variants: any[];
  featured: boolean;
}

interface Brand {
  id: string;
  name: string;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  active: boolean;
}

interface ProductFormProps {
  product?: Product;
  onSubmitSuccess: () => void;
}

export default function ProductForm({ product, onSubmitSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    brand: '',
    category: '',
    images: [] as string[],
    variants: [] as any[],
    featured: false,
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBrands();
    loadCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        brand: product.brand || '',
        category: product.category || '',
        images: product.images || [],
        variants: product.variants || [],
        featured: product.featured || false,
      });
    }
  }, [product]);

  const loadBrands = async () => {
    setIsLoadingBrands(true);
    try {
      // TODO: Replace with actual API call
      // const activeBrands = await Brand.filter({ active: true }, 'sort_order');
      
      // Mock data for now
      const activeBrands: Brand[] = [
        { id: '1', name: 'FastDrill', active: true },
        { id: '2', name: 'Spider', active: true },
        { id: '3', name: 'Gorkha', active: true },
      ];
      
      setBrands(activeBrands);
    } catch (error) {
      console.error("Failed to load brands:", error);
      setBrands([]);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      // TODO: Replace with actual API call
      // const activeCategories = await Category.filter({ active: true }, 'sort_order');
      
      // Mock data for now
      const activeCategories: Category[] = [
        { id: '1', name: 'Tools', active: true },
        { id: '2', name: 'Hardware', active: true },
        { id: '3', name: 'Construction', active: true },
        { id: '4', name: 'Electrical', active: true },
      ];
      
      setCategories(activeCategories);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await Promise.all([loadBrands(), loadCategories()]);
    setIsRefreshing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = { ...formData };
      // Auto-generate slug if empty
      if (!dataToSave.slug && dataToSave.name) {
        dataToSave.slug = dataToSave.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      // TODO: Replace with actual API calls
      if (product && product.id) {
        // await Product.update(product.id, dataToSave);
        console.log('Updating product:', product.id, dataToSave);
      } else {
        // await Product.create(dataToSave);
        console.log('Creating product:', dataToSave);
      }
      
      onSubmitSuccess();
    } catch (error) {
      console.error('Failed to save product', error);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Lists
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-if-empty" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          {isLoadingBrands ? (
            <div className="flex items-center justify-center h-10 border border-gray-300 rounded-md">
              <span className="text-sm text-gray-500">Loading brands...</span>
            </div>
          ) : (
            <Select value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {brands.length === 0 && !isLoadingBrands && (
            <p className="text-sm text-red-600">No active brands found. Please create a brand first.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          {isLoadingCategories ? (
            <div className="flex items-center justify-center h-10 border border-gray-300 rounded-md">
              <span className="text-sm text-gray-500">Loading categories...</span>
            </div>
          ) : (
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {categories.length === 0 && !isLoadingCategories && (
            <p className="text-sm text-red-600">No active categories found. Please create a category first.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <ImageUploader files={formData.images} setFiles={(images) => setFormData(prev => ({ ...prev, images }))} />
      </div>

      <div className="space-y-2">
        <Label>Variants</Label>
        <VariantManager variants={formData.variants} setVariants={(variants) => setFormData(prev => ({ ...prev, variants }))} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="featured" 
          checked={formData.featured} 
          onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, featured: !!checked }))} 
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving || brands.length === 0 || categories.length === 0}>
          {isSaving ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
