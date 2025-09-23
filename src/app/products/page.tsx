'use client'

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { Product, Category } from "@/lib/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import {
  Search,
  Filter,
  Package,
  Grid,
  List,
  Star,
  ArrowRight
} from "lucide-react";

const brands = ["All", "FastDrill", "Spider", "Gorkha", "General Imports"];
const stockStatuses = ["All", "In Stock", "Low Stock", "Pre-Order"];

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStock, setSelectedStock] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== "All") {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Stock filter
    if (selectedStock !== "All") {
      filtered = filtered.filter(product =>
        product.variants?.some((variant: any) => variant.stock_status === selectedStock)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'newest':
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedStock, sortBy]);

  useEffect(() => {
    loadProducts();
    loadCategories();
    // Check URL parameters for initial filters
    const urlParams = new URLSearchParams(window.location.search);
    const brand = urlParams.get('brand');
    const search = urlParams.get('search');
    
    if (brand) setSelectedBrand(brand);
    if (search) setSearchQuery(search);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadProducts = async () => {
    setIsLoading(true);
    const allProducts = await Product.list('-created_date');
    setProducts(allProducts);
    setIsLoading(false);
  };

  const loadCategories = async () => {
    try {
      const activeCategories = await Category.filter({ active: true }, 'sort_order');
      setCategories(['All', ...activeCategories.map((cat: any) => cat.name)]);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories(['All']);
    }
  };

  const ProductCard = ({ product, isListView = false }: { product: any, isListView?: boolean }) => (
    <Link
      href={`${createPageUrl("ProductDetail")}?slug=${product.slug}&from=Products`}
      className="group block h-full"
    >
      <Card className={`h-full overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 ${
        isListView ? 'flex' : 'flex flex-col'
      }`}>
        <div className={`relative overflow-hidden bg-gray-100 flex-shrink-0 ${
          isListView ? 'w-48' : 'h-44'
        }`}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <Badge className="absolute top-4 left-4 bg-red-600">
            {product.brand}
          </Badge>
          {product.featured && (
            <div className="absolute top-4 right-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-red-600 transition-colors line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>

            {/* Variants Display */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.variants.slice(0, 4).map((variant: any, index: number) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded"
                  >
                    {variant.size || 'Standard'}
                  </span>
                ))}
                {product.variants.length > 4 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded">
                    +{product.variants.length - 4} more
                  </span>
                )}
              </div>
            )}
            
            <p className="text-gray-600 mb-3 line-clamp-2 text-sm min-h-[2.5rem]">
              {product.description || 'No description available'}
            </p>
            
            {product.variants && product.variants.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={
                    product.variants[0].stock_status === 'In Stock' ? 'text-green-600 border-green-600 bg-green-50' :
                    product.variants[0].stock_status === 'Low Stock' ? 'text-yellow-600 border-yellow-600 bg-yellow-50' :
                    product.variants[0].stock_status === 'Out of Stock' ? 'text-red-600 border-red-600 bg-red-50' :
                    'text-blue-600 border-blue-600 bg-blue-50'
                  }>
                    {product.variants[0].stock_status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm text-gray-500">{product.category || 'Uncategorized'}</span>
            <div className="flex items-center text-red-600 group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight className="ml-1 w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <Layout currentPageName="Products">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600">
              Discover our complete range of premium imported products
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>

                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select 
                  value={selectedStock} 
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md"
                >
                  {stockStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div>
              <p className="text-gray-600">
                {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md"
              >
                <option value="name">Sort by Name</option>
                <option value="brand">Sort by Brand</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-44 bg-gray-200"></div>
                  <CardContent className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedBrand("All");
                setSelectedCategory("All");
                setSelectedStock("All");
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isListView={viewMode === 'list'} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}