'use client'

import React, { useState, useEffect } from 'react';
import { Order } from '@/lib/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { format } from 'date-fns';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await Order.list('-created_date');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <Layout currentPageName="AdminOrders">
        <div className="p-6">Loading orders...</div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="AdminOrders">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>All Orders ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Dealer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total (NPR)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{format(new Date(order.created_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.dealer_email}</TableCell>
                      <TableCell>{order.product_items.length} items</TableCell>
                      <TableCell>{order.total_amount_npr.toLocaleString('en-US')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
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