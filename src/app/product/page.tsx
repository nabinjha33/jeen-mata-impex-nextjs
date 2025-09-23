'use client'

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { Product } from "@/lib/entities";
import type { Product as ProductType, ProductVariant } from "@/lib/entities/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAppContext } from "@/components/AppContext";
import useCart from "@/lib/hooks/useCart";
import {
  ArrowLeft,
  Package,
  Star,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  Clock,
  Plus,
  Minus
} from "lucide-react";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const { getText } = useAppContext();
  const orderCart = useCart('orderCart');
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addToCartStatus, setAddToCartStatus] = useState<string | null>(null);
  
  const slug = searchParams.get('slug');
  const fromPage = searchParams.get('from');

  // Page name mapping for back navigation
  const pageNameMap: Record<string, string> = {
    'Home': 'Home',
    'Products': 'Products',
    'GorkhaBrand': 'Gorkha',
    'FastDrillBrand': 'FastDrill',
    'SpiderBrand': 'Spider'
  };

  const backLink = {
    url: createPageUrl(fromPage || 'Products'),
    text: pageNameMap[fromPage || ''] || 'Products'
  };

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const products = await Product.list();
      const foundProduct = products.find((p: ProductType) => p.slug === slug);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    }
    setIsLoading(false);
  };

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      orderCart.addToCart(product, selectedVariant, quantity);
      setAddToCartStatus('Added to cart successfully!');
      setTimeout(() => setAddToCartStatus(null), 3000);
    }
  };

  const updateQuantity = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <Layout currentPageName="ProductDetail">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout currentPageName="ProductDetail">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">The product you're looking for doesn't exist.</p>
            <Link href={createPageUrl("Products")}>
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="ProductDetail">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href={backLink.url}>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getText(`Back to ${backLink.text}`, `${backLink.text} मा फर्किनुहोस्`)}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
                
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                    <Star className="w-4 h-4 mr-1" />
                    {getText('Featured', 'विशेष')}
                  </Badge>
                )}
              </div>

              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-red-600 text-white">{product.brand}</Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{product.category}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description || getText('No description available', 'विवरण उपलब्ध छैन')}
                </p>
              </div>

              {/* Variants Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getText('Available Variants', 'उपलब्ध प्रकारहरू')}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {product.variants.map((variant: ProductVariant) => (
                      <Card
                        key={variant.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedVariant?.id === variant.id
                            ? 'ring-2 ring-red-500 border-red-500 dark:ring-red-400 dark:border-red-400'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {variant.size || 'Standard'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {variant.packaging}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-gray-900 dark:text-white">
                                NPR {variant.estimated_price_npr?.toLocaleString() || 'Price on request'}
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  variant.stock_status === 'In Stock'
                                    ? 'text-green-600 border-green-600 bg-green-50 dark:text-green-400 dark:border-green-400'
                                    : variant.stock_status === 'Low Stock'
                                    ? 'text-yellow-600 border-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-400'
                                    : 'text-red-600 border-red-600 bg-red-50 dark:text-red-400 dark:border-red-400'
                                }
                              >
                                {variant.stock_status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              {selectedVariant && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getText('Quantity', 'मात्रा')}
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {addToCartStatus && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-800 dark:text-green-300">{addToCartStatus}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-12"
                    disabled={selectedVariant.stock_status === 'Out of Stock'}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {selectedVariant.stock_status === 'Out of Stock'
                      ? getText('Out of Stock', 'स्टक सकियो')
                      : getText('Add to Cart', 'कार्टमा थप्नुहोस्')
                    }
                  </Button>

                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      {getText('Need to place an order?', 'अर्डर गर्न आवश्यक छ?')}
                    </h4>
                    <p className="text-blue-800 dark:text-blue-300 text-sm mb-3">
                      {getText(
                        'Join our dealer network to access wholesale pricing and place orders.',
                        'होलसेल मूल्य निर्धारण र अर्डर गर्न हाम्रो डिलर नेटवर्कमा सामेल हुनुहोस्।'
                      )}
                    </p>
                    <Link href={createPageUrl("DealerLogin")}>
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400">
                        {getText('Become a Dealer', 'डिलर बन्नुहोस्')}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Truck className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getText('Fast Import', 'छिटो आयात')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getText('Direct from source', 'स्रोतबाट प्रत्यक्ष')}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getText('Quality Assured', 'गुणस्तर आश्वासन')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getText('Tested products', 'परीक्षण गरिएका उत्पादनहरू')}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {getText('Quick Delivery', 'छिटो डेलिभरी')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {getText('Tracked shipments', 'ट्र्याक गरिएका ढुवानी')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function ProductDetail() {
  return (
    <Suspense fallback={
      <Layout currentPageName="ProductDetail">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </Layout>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}