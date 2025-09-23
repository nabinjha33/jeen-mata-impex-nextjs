'use client'

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { Product } from "@/lib/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useAppContext } from "@/components/AppContext";
import type { Product as ProductType, ProductVariant } from "@/lib/entities/types";
import {
  ArrowLeft,
  Package,
  Star,
  Share2,
  Heart,
  ShoppingCart,
  Info
} from "lucide-react";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const { getText } = useAppContext();
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [backLink, setBackLink] = useState({ url: createPageUrl("Products"), text: "Products" });
  
  const slug = searchParams.get('slug');
  const fromPage = searchParams.get('from');

  useEffect(() => {
    loadProduct();
  }, [slug, fromPage]);

  const loadProduct = async () => {
    setIsLoading(true);
    
    if (fromPage) {
      const pageNameMap: Record<string, string> = {
        'Home': 'Home',
        'Products': 'Products',
        'DealerCatalog': 'Dealer Catalog',
        'FastDrillBrand': 'FastDrill',
        'SpiderBrand': 'Spider',
        'GorkhaBrand': 'Gorkha',
        'GeneralImportsBrand': 'General Imports'
      };
      
      const pageText = pageNameMap[fromPage] || 'Products';
      if (pageNameMap[fromPage]) {
        setBackLink({ url: createPageUrl(fromPage), text: pageText });
      }
    }
    
    if (slug) {
      const products = await Product.filter({ slug: slug });
      if (products.length > 0) {
        setProduct(products[0]);
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Layout currentPageName="ProductDetail">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">{getText("The product you're looking for doesn't exist.", "तपाईंले खोजिरहनुभएको उत्पादन अवस्थित छैन।")}</p>
            <Link href={createPageUrl("Products")}>
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [null];

  return (
    <Layout currentPageName="ProductDetail">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={createPageUrl("Home")} className="hover:text-red-600">Home</Link>
            <span>/</span>
            <Link href={backLink.url} className="hover:text-red-600">{backLink.text}</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200">
                <div className="aspect-square flex items-center justify-center">
                  {images[currentImageIndex] ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Package className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {product.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image: string | null, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-red-600' : 'border-gray-200'
                      }`}
                    >
                      {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-red-600 text-white">{product.brand}</Badge>
                  <span className="text-sm text-gray-600">{product.category}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                
                {product.description && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={createPageUrl("DealerLogin")} className="flex-1">
                  <Button className="w-full bg-red-600 hover:bg-red-700 h-12">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Request Quote as Dealer
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Brand</h4>
                      <p className="text-gray-600">{product.brand}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                      <p className="text-gray-600">{product.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Variants</h4>
                      <p className="text-gray-600">
                        {product.variants ? product.variants.length : 0} Available
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Origin</h4>
                      <p className="text-gray-600">China/India Import</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="variants" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="variants">Product Variants</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="variants" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Available Variants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>Packaging</TableHead>
                            <TableHead>Estimated Price (NPR)</TableHead>
                            <TableHead>Stock Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.variants.map((variant: ProductVariant, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {variant.size || '-'}
                              </TableCell>
                              <TableCell>{variant.packaging || '-'}</TableCell>
                              <TableCell>
                                {variant.estimated_price_npr ? 
                                  `NPR ${variant.estimated_price_npr.toLocaleString()}` : 
                                  'Contact for Price'
                                }
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    variant.stock_status === 'In Stock' ? 'text-green-600 border-green-600 bg-green-50' :
                                    variant.stock_status === 'Low Stock' ? 'text-yellow-600 border-yellow-600 bg-yellow-50' :
                                    variant.stock_status === 'Out of Stock' ? 'text-red-600 border-red-600 bg-red-50' :
                                    'text-blue-600 border-blue-600 bg-blue-50'
                                  }
                                >
                                  {variant.stock_status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No variant information available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">General Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Brand:</span>
                          <span className="font-medium">{product.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Origin:</span>
                          <span className="font-medium">China/India</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Availability</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Variants:</span>
                          <span className="font-medium">
                            {product.variants ? product.variants.length : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Featured:</span>
                          <span className="font-medium">
                            {product.featured ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Interested in this product?
            </h3>
            <p className="text-red-100 mb-6 max-w-2xl mx-auto">
              Join our dealer network to access wholesale pricing and place orders for this and thousands of other premium products.
            </p>
            <Link href={createPageUrl("DealerLogin")}>
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 h-12 px-8">
                Request Dealer Access
              </Button>
            </Link>
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