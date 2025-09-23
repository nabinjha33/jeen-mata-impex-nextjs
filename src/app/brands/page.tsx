'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { Brand, Product } from "@/lib/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAppContext } from "@/components/AppContext";
import {
  Package,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  TrendingUp
} from "lucide-react";

export default function Brands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [brandStats, setBrandStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { getText } = useAppContext();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const [activeBrands, allProducts] = await Promise.all([
        Brand.filter({ active: true }, 'sort_order'),
        Product.list()
      ]);

      setBrands(activeBrands);

      // Calculate product count per brand
      const stats: Record<string, number> = {};
      allProducts.forEach((product: any) => {
        stats[product.brand] = (stats[product.brand] || 0) + 1;
      });
      setBrandStats(stats);
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
    setIsLoading(false);
  };

  const getBrandPageUrl = (brandSlug: string) => {
    switch (brandSlug) {
      case 'fastdrill':
        return createPageUrl('FastDrillBrand');
      case 'spider':
        return createPageUrl('SpiderBrand');
      case 'gorkha':
        return createPageUrl('GorkhaBrand');
      default:
        return createPageUrl('GeneralImportsBrand');
    }
  };

  return (
    <Layout currentPageName="Brands">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {getText('Our Premium Brands', 'हाम्रा प्रिमियम ब्रान्डहरू')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {getText(
                'We partner with the most trusted manufacturers from China and India to bring you quality products with competitive pricing.',
                'हामी तपाईंलाई प्रतिस्पर्धी मूल्यका साथ गुणस्तरीय उत्पादनहरू ल्याउन चीन र भारतका सबैभन्दा विश्वसनीय निर्माताहरूसँग साझेदारी गर्छौं।'
              )}
            </p>
          </div>

          {/* Brands Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={getBrandPageUrl(brand.slug)}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 dark:bg-gray-800 dark:border-gray-700">
                    <div className="relative h-64 overflow-hidden">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center">
                          <Package className="w-20 h-20 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      {/* Brand Name Overlay */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-3xl font-bold mb-1">{brand.name}</h2>
                        <div className="flex items-center gap-2 text-blue-200">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{brand.origin_country}</span>
                        </div>
                      </div>

                      {/* Product Count Badge */}
                      <Badge className="absolute top-4 right-4 bg-white/90 text-gray-900 hover:bg-white">
                        {brandStats[brand.name] || 0} {getText('Products', 'उत्पादनहरू')}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[3rem]">
                          {brand.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{getText('Est.', 'स्थापना')} {brand.established_year}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{brand.specialty}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getText('Specialty:', 'विशेषता:')} {brand.specialty}
                          </div>
                          <div className="flex items-center text-red-600 dark:text-red-400 group-hover:translate-x-2 transition-transform duration-300">
                            <span className="font-medium text-sm">
                              {getText('Explore', 'अन्वेषण गर्नुहोस्')}
                            </span>
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Features Section */}
          <section className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {getText('Why Our Brands Stand Out', 'हाम्रा ब्रान्डहरू किन उत्कृष्ट छन्')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {getText('Quality Certified', 'गुणस्तर प्रमाणित')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {getText('All brands meet international quality standards', 'सबै ब्रान्डहरू अन्तर्राष्ट्रिय गुणस्तर मापदण्डहरू पूरा गर्छन्')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {getText('Market Leaders', 'बजार नेताहरू')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {getText('Established brands with proven track records', 'सिद्ध ट्र्याक रेकर्डका साथ स्थापित ब्रान्डहरू')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {getText('Wide Range', 'व्यापक दायरा')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {getText('Comprehensive product portfolios for all needs', 'सबै आवश्यकताहरूको लागि व्यापक उत्पादन पोर्टफोलियो')}
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-20 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {getText('Ready to Partner with Us?', 'हामीसँग साझेदारी गर्न तयार हुनुहुन्छ?')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {getText(
                'Join our dealer network and get access to these premium brands with wholesale pricing.',
                'हाम्रो डिलर नेटवर्कमा सामेल हुनुहोस् र होलसेल मूल्यका साथ यी प्रिमियम ब्रान्डहरूमा पहुँच प्राप्त गर्नुहोस्।'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={createPageUrl("DealerLogin")}>
                <Button size="lg" className="bg-white text-red-600 hover:bg-gray-50 dark:bg-gray-100 dark:text-red-700 dark:hover:bg-gray-200">
                  {getText('Become a Dealer', 'डिलर बन्नुहोस्')}
                </Button>
              </Link>
              <Link href={createPageUrl("Products")}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 dark:border-gray-200 dark:hover:bg-white/10">
                  {getText('Browse Products', 'उत्पादनहरू हेर्नुहोस्')}
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}