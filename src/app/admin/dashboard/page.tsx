'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { Product, Order, DealerApplication, User } from "@/lib/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalProducts: number;
    totalOrders: number;
    pendingApplications: number;
    totalDealers: number;
    recentOrders: any[];
    recentApplications: any[];
  }>({
    totalProducts: 0,
    totalOrders: 0,
    pendingApplications: 0,
    totalDealers: 0,
    recentOrders: [],
    recentApplications: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [products, orders, applications, users] = await Promise.all([
        Product.list(),
        Order.list('-created_date'),
        DealerApplication.list('-created_date'),
        User.list()
      ]);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingApplications: applications.filter((app: any) => app.status === 'Pending').length,
        totalDealers: users.filter((user: any) => user.dealer_status === 'Approved').length,
        recentOrders: orders.slice(0, 5),
        recentApplications: applications.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
    setIsLoading(false);
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout currentPageName="AdminDashboard">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Overview of your Jeen Mata Impex platform</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              trend="+12% from last month"
              color="bg-blue-500"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              trend="+8% from last month"
              color="bg-green-500"
            />
            <StatCard
              title="Pending Applications"
              value={stats.pendingApplications}
              icon={AlertCircle}
              trend="Needs attention"
              color="bg-yellow-500"
            />
            <StatCard
              title="Active Dealers"
              value={stats.totalDealers}
              icon={Users}
              trend="+5% from last month"
              color="bg-red-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
                <Link href={createPageUrl("AdminOrders")}>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No recent orders</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-gray-500">{order.dealer_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">NPR {order.total_amount_npr?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">Pending Dealer Applications</CardTitle>
                <Link href={createPageUrl("AdminDealers")}>
                  <Button variant="outline" size="sm">
                    Review All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentApplications.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending applications</p>
                ) : (
                  <div className="space-y-4">
                    {stats.recentApplications.map((app: any) => (
                      <div key={app.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          app.status === 'Pending' ? 'bg-yellow-100' :
                          app.status === 'Approved' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {app.status === 'Pending' ? (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          ) : app.status === 'Approved' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{app.business_name}</p>
                          <p className="text-sm text-gray-500">{app.contact_person}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link href={createPageUrl("AdminProducts")}>
                <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                  <Package className="w-6 h-6" />
                  Manage Products
                </Button>
              </Link>
              <Link href={createPageUrl("AdminOrders")}>
                <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                  <ShoppingCart className="w-6 h-6" />
                  View Orders
                </Button>
              </Link>
              <Link href={createPageUrl("AdminDealers")}>
                <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                  <Users className="w-6 h-6" />
                  Manage Dealers
                </Button>
              </Link>
              <Link href={createPageUrl("AdminBrands")}>
                <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                  <BarChart3 className="w-6 h-6" />
                  Manage Brands
                </Button>
              </Link>
              <Link href={createPageUrl("AdminSettings")}>
                <Button variant="outline" className="h-20 flex-col gap-2 w-full">
                  <AlertCircle className="w-6 h-6" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}