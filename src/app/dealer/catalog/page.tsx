'use client'

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { Product, Category } from "@/lib/entities";
import useCart from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import {
  Search,
  Package,
  ShoppingCart,
  Plus,
  Star,
  Filter,
  Grid,
  List
} from "lucide-react";

const brands = ["All", "FastDrill", "Spider", "Gorkha", "General Imports"];
const stockStatuses = ["All", "In Stock", "Low Stock", "Pre-Order"];

export default function DealerCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStock, setSelectedStock] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const orderCart = useCart('orderCart');

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

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedBrand, selectedCategory, selectedStock]);

  useEffect(() => {
    loadProducts();
    loadCategories();
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

  const handleAddToCart = (product: any, variant: any) => {
    orderCart.addToCart(product, variant, 1);
    // Could add a toast notification here
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
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
      
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3 mb-4">
            {product.variants.map((variant: any) => (
              <div key={variant.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">{variant.size || 'Standard'}</div>
                  <div className="text-xs text-gray-500">{variant.packaging}</div>
                </div>
                <div className="text-right mr-3">
                  <div className="font-bold">NPR {variant.estimated_price_npr?.toLocaleString()}</div>
                  <Badge variant="outline" className={
                    variant.stock_status === 'In Stock' ? 'text-green-600 border-green-600' :
                    variant.stock_status === 'Low Stock' ? 'text-yellow-600 border-yellow-600' :
                    'text-red-600 border-red-600'
                  }>
                    {variant.stock_status}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product, variant)}
                  disabled={variant.stock_status === 'Out of Stock'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{product.category}</span>
          <Link href={`${createPageUrl("ProductDetail")}?slug=${product.slug}&from=DealerCatalog`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout currentPageName="DealerCatalog">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dealer Catalog</h1>
              <p className="text-gray-600">Browse and order products at wholesale prices</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={createPageUrl("OrderCart")}>
                <Button className="bg-red-600 hover:bg-red-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({orderCart.getCartItemCount()})
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
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

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !isLoading && (
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
          )}
        </div>
      </div>
    </Layout>
  );
}