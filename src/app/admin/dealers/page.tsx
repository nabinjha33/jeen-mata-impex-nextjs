'use client'

import React, { useState, useEffect } from 'react';
import { DealerApplication, User } from '@/lib/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Users, UserCheck, UserX } from 'lucide-react';

export default function AdminDealers() {
  const [applications, setApplications] = useState<any[]>([]);
  const [dealers, setDealers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apps, users] = await Promise.all([
          DealerApplication.list('-created_date'),
          User.list()
        ]);
        setApplications(apps);
        setDealers(users.filter((user: any) => user.dealer_status === 'Approved'));
      } catch (error) {
        console.error('Failed to fetch dealer data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Layout currentPageName="AdminDealers">
        <div className="p-6">Loading dealer management...</div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="AdminDealers">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dealer Management</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Pending Applications ({applications.filter(app => app.status === 'Pending').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.filter(app => app.status === 'Pending').map(app => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.business_name}</TableCell>
                        <TableCell>{app.contact_person}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <UserCheck className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <UserX className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Active Dealers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Dealers ({dealers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dealers.map(dealer => (
                      <TableRow key={dealer.id}>
                        <TableCell className="font-medium">{dealer.business_name || 'N/A'}</TableCell>
                        <TableCell>{dealer.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {dealer.dealer_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}