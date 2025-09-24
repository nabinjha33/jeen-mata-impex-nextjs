'use client'

import React, { useState, useEffect } from 'react';
import { Shipment } from '@/lib/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { Ship } from 'lucide-react';

export default function AdminShipments() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await Shipment.list('-created_date');
        setShipments(data);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      }
      setIsLoading(false);
    };
    fetchShipments();
  }, []);

  if (isLoading) {
    return (
      <Layout currentPageName="AdminShipments">
        <div className="p-6">Loading shipments...</div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="AdminShipments">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Shipments</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="w-5 h-5" />
                All Shipments ({shipments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map(shipment => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.tracking_number}</TableCell>
                      <TableCell>{shipment.origin_country}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{shipment.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(shipment.eta_date).toLocaleDateString()}</TableCell>
                      <TableCell>{shipment.product_names?.length || 0} items</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}