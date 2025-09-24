'use client'

import React, { useState, useEffect } from 'react';
import { Brand } from '@/lib/entities';
import Layout from '@/components/Layout';
import BrandPageLayout from '@/components/brands/BrandPageLayout';

export default function GorkhaBrand() {
  const [brandData, setBrandData] = useState<any>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      const brands = await Brand.filter({ slug: 'gorkha' });
      if (brands.length > 0) {
        setBrandData(brands[0]);
      }
    };
    fetchBrand();
  }, []);

  if (!brandData) {
    return (
      <Layout currentPageName="GorkhaBrand">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Gorkha brand...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="GorkhaBrand">
      <BrandPageLayout brand={brandData} />
    </Layout>
  );
}