'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { Product, Brand } from "@/lib/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAppContext } from "@/components/AppContext";
import {
  ArrowLeft,
  Package,
  Star,
  TrendingUp,
  ArrowRight,
  Calendar,
  MapPin,
  Award
} from "lucide-react";

export default function FastDrillBrand() {
  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getText } = useAppContext();

  useEffect(() => {
    loadBrandData();
  }, []);

  const loadBrandData = async () => {
    setIsLoading(true);
    try {
      const [allBrands, brandProducts] = await Promise.all([
        Brand.list(),
        Product.filter({ brand: 'FastDrill' }, '-created_date')
      ]);
      
      const fastDrillBrand = allBrands.find((b: any) => b.slug === 'fastdrill');
      setBrand(fastDrillBrand);
      setProducts(brandProducts);
    } catch (error) {
      console.error('Failed to load brand data:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Layout currentPageName="FastDrillBrand">
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-700"></div>
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="FastDrillBrand">
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-8">
              <Link href={createPageUrl("Brands")}>
                <Button variant="ghost" className="text-white hover:text-blue-300 hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {getText('Back to Brands', 'ब्रान्डहरूमा फर्किनुहोस्')}
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {brand?.logo ? (
                  <img src={brand.logo} alt="FastDrill" className="w-16 h-16 rounded-lg" />
                ) : (
                  <Package className="w-12 h-12 text-blue-300" />
                )}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                FastDrill
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {getText(
                  'Professional power tools and drilling equipment from China',
                  'चीनबाट व्यावसायिक पावर उपकरण र ड्रिलिंग उपकरणहरू'
                )}
              </p>

              {brand && (
                <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{getText('Est.', 'स्थापना')} {brand.established_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{brand.origin_country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>{brand.specialty}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {getText('FastDrill Products', 'FastDrill उत्पादनहरू')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {getText('Professional grade tools for serious work', 'गम्भीर कामका लागि व्यावसायिक स्तरका उपकरणहरू')}
                </p>
              </div>
              <Link href={`${createPageUrl("Products")}?brand=FastDrill`}>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400">
                  {getText('View All FastDrill Products', 'सबै FastDrill उत्पादनहरू हेर्नुहोस्')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {getText('No FastDrill products found', 'कुनै FastDrill उत्पादनहरू फेला परेन')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {getText('Products will be added soon', 'उत्पादनहरू छिट्टै थप गरिनेछ')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`${createPageUrl("ProductDetail")}?slug=${product.slug}&from=FastDrillBrand`}
                    className="group block"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700">
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        
                        {product.featured && (
                          <div className="absolute top-4 right-4">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem] text-gray-900 dark:text-white">
                            {product.name}
                          </h3>

                          {/* Variants Display */}
                          {product.variants && product.variants.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {product.variants.slice(0, 3).map((variant: any, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded"
                                >
                                  {variant.size || 'Standard'}
                                </span>
                              ))}
                              {product.variants.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded">
                                  +{product.variants.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 min-h-[4rem]">
                            {product.description || getText('No description available', 'विवरण उपलब्ध छैन')}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                            {product.variants?.[0]?.stock_status || getText("In Stock", "स्टकमा छ")}
                          </Badge>
                          <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{getText("View Details", "विवरण हेर्नुहोस्")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Brand Features */}
        <section className="py-16 bg-blue-900/50 dark:bg-blue-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12 text-white">
              {getText('Why Choose FastDrill?', 'FastDrill किन छनौट गर्ने?')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {getText('Professional Grade', 'व्यावसायिक स्तर')}
                </h3>
                <p className="text-blue-200">
                  {getText('Built for professionals and serious DIY enthusiasts', 'व्यावसायिकहरू र गम्भीर DIY उत्साहीहरूका लागि निर्मित')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {getText('Proven Quality', 'सिद्ध गुणस्तर')}
                </h3>
                <p className="text-blue-200">
                  {getText('Over 25 years of manufacturing excellence', '२५ वर्षभन्दा बढी निर्माण उत्कृष्टता')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {getText('Complete Range', 'पूर्ण दायरा')}
                </h3>
                <p className="text-blue-200">
                  {getText('From basic tools to advanced drilling systems', 'आधारभूत उपकरणहरूदेखि उन्नत ड्रिलिंग प्रणालीहरू सम्म')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-800 to-indigo-800 dark:from-blue-900 dark:to-indigo-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              {getText('Ready to Access FastDrill Products?', 'FastDrill उत्पादनहरूमा पहुँच गर्न तयार हुनुहुन्छ?')}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {getText(
                'Join our dealer network to get wholesale access to FastDrill\'s complete product range.',
                'FastDrill को पूर्ण उत्पादन दायरामा होलसेल पहुँच प्राप्त गर्न हाम्रो डिलर नेटवर्कमा सामेल हुनुहोस्।'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={createPageUrl("DealerLogin")}>
                <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 dark:bg-gray-100 dark:text-blue-900 dark:hover:bg-gray-200">
                  {getText('Become a Dealer', 'डिलर बन्नुहोस्')}
                </Button>
              </Link>
              <Link href={`${createPageUrl("Products")}?brand=FastDrill`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 dark:border-gray-200">
                  {getText('View All Products', 'सबै उत्पादनहरू हेर्नुहोस्')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}