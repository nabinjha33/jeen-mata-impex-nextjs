'use client'

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { SiteSettings, PageVisit, User } from "@/lib/entities";
import { useAppContext } from "@/components/AppContext";
import {
  Package,
  Briefcase,
  ShoppingCart,
  Ship,
  User as UserIcon,
  BarChart3,
  Award,
  Upload,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

const publicRoutes = [
  { title: "Home", url: createPageUrl("Home") },
  { title: "Brands", url: createPageUrl("Brands") },
  { title: "Products", url: createPageUrl("Products") }
];

const dealerRoutes = [
  { title: "Catalog", url: createPageUrl("DealerCatalog"), icon: Package },
  { title: "My Orders", url: createPageUrl("MyOrders"), icon: Briefcase },
  { title: "Order Cart", url: createPageUrl("OrderCart"), icon: ShoppingCart },
  { title: "Shipments", url: createPageUrl("Shipments"), icon: Ship },
  { title: "Profile", url: createPageUrl("DealerProfile"), icon: UserIcon }
];

const adminRoutes = [
  { title: "Dashboard", url: createPageUrl("AdminDashboard"), icon: BarChart3 },
  { title: "Orders", url: createPageUrl("AdminOrders"), icon: Briefcase },
  { title: "Brands", url: createPageUrl("AdminBrands"), icon: Award },
  { title: "Categories", url: createPageUrl("AdminCategories"), icon: Award },
  { title: "Products", url: createPageUrl("AdminProducts"), icon: Package },
  { title: "Bulk Import", url: createPageUrl("AdminBulkUpload"), icon: Upload },
  { title: "Shipments", url: createPageUrl("AdminShipments"), icon: Ship },
  { title: "Dealer Management", url: createPageUrl("AdminDealers"), icon: Users },
  { title: "User Management", url: createPageUrl("AdminUsers"), icon: Users },
  { title: "Settings", url: createPageUrl("AdminSettings"), icon: Settings }
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName?: string;
}

function LayoutContent({ children, currentPageName }: LayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isDark, toggleTheme, language, toggleLanguage, getText } = useAppContext();
  const [siteInfo, setSiteInfo] = useState({
    company_name: 'Jeen Mata Impex',
    tagline: 'Premium Import Solutions',
    contact_email: 'jeenmataimpex8@gmail.com',
    contact_phone: '+977-1-XXXXXXX',
    contact_address: 'Kathmandu, Nepal'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsList = await SiteSettings.list();
        if (settingsList.length > 0) {
          setSiteInfo(settingsList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Effect to track page visits
  useEffect(() => {
    const trackVisit = async () => {
      // Don't track visits for admin pages
      if (currentPageName?.startsWith('Admin')) {
        return;
      }
      
      try {
        let userEmail = null;
        try {
          const currentUser = await User.me();
          if (currentUser) {
            userEmail = currentUser.email;
          }
        } catch (e) {
          // User is not logged in, which is fine.
        }

        await PageVisit.create({
          path: pathname + (searchParams.toString() ? '?' + searchParams.toString() : ''),
          page: currentPageName || 'Unknown',
          user_email: userEmail || undefined,
          user_agent: navigator.userAgent
        });
      } catch (error) {
        console.warn("Failed to track page visit:", error);
      }
    };

    trackVisit();
  }, [pathname, searchParams, currentPageName]);

  // Determine layout type based on current page
  const isAdminPage = currentPageName?.startsWith('Admin');
  const isDealerPage = ['DealerCatalog', 'MyOrders', 'OrderCart', 'Shipments', 'DealerProfile'].includes(currentPageName || '');
  const isPublicPage = !isAdminPage && !isDealerPage;

  // Public Layout (No Sidebar)
  if (isPublicPage) {
    return (
      <div className="min-h-screen">
        {/* Public Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-red-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href={createPageUrl("Home")} className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                    {siteInfo.company_name}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    {getText(siteInfo.tagline, 'प्रिमियम आयात समाधान')}
                  </p>
                </div>
              </Link>

              <nav className="hidden md:flex space-x-8">
                {publicRoutes.map((route) => (
                  <Link
                    key={route.title}
                    href={route.url}
                    className={`text-sm font-medium transition-colors hover:text-red-600 dark:hover:text-red-400 ${
                      pathname === route.url ? 
                        'text-red-600 dark:text-red-400' : 
                        'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {getText(
                      route.title,
                      route.title === 'Home' ? 'घर' : 
                      route.title === 'Brands' ? 'ब्रान्डहरू' : 
                      route.title === 'Products' ? 'उत्पादनहरू' : 
                      route.title
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleLanguage}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {language.toUpperCase()}
                </Button>
                <Link href={createPageUrl("DealerLogin")}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 transition-colors">
                    {getText('Dealer Login', 'डीलर लगइन')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main>{children}</main>

        {/* Public Footer */}
        <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">{siteInfo.company_name}</h3>
                <p className="text-gray-400 text-sm">
                  {getText(siteInfo.tagline, 'प्रिमियम आयात समाधान')}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{getText('Our Brands', 'हाम्रा ब्रान्डहरू')}</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>FastDrill</li>
                  <li>Spider</li>
                  <li>Gorkha</li>
                  <li>General Imports</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{getText('Services', 'सेवाहरू')}</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>{getText('Import Solutions', 'आयात समाधान')}</li>
                  <li>{getText('Dealer Support', 'डीलर सहयोग')}</li>
                  <li>{getText('Shipment Tracking', 'ढुवानी ट्र्याकिङ')}</li>
                  <li>{getText('Quality Assurance', 'गुणस्तर आश्वासन')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{getText('Contact', 'सम्पर्क')}</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  {siteInfo.contact_address && <p>{siteInfo.contact_address}</p>}
                  {siteInfo.contact_email && <p>{siteInfo.contact_email}</p>}
                  {siteInfo.contact_phone && <p>{siteInfo.contact_phone}</p>}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 {siteInfo.company_name}. {getText('All rights reserved.', 'सबै अधिकार सुरक्षित।')}</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Sidebar Layout for Dealer & Admin
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header for Admin/Dealer */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={createPageUrl("Home")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Jeen Mata Impex</h2>
                <p className="text-xs text-red-600">{isAdminPage ? 'Admin' : 'Dealer'} Portal</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-600 dark:text-gray-300"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language.toUpperCase()}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
        <nav className="flex items-center gap-6 overflow-x-auto">
          {(isAdminPage ? adminRoutes : dealerRoutes).map((route) => (
            <Link
              key={route.title}
              href={route.url}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === route.url
                  ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <route.icon className="w-4 h-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <LayoutContent currentPageName={currentPageName}>
        {children}
      </LayoutContent>
    </Suspense>
  );
}