'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Upload } from 'lucide-react';

export default function AdminBulkUpload() {
  return (
    <Layout currentPageName="AdminBulkUpload">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Bulk Upload</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bulk Upload Coming Soon</h3>
                <p className="text-gray-600 mb-6">This feature will allow you to upload multiple products at once.</p>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}