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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
        } catch {
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

  // Sidebar Layout (Dealer & Admin) - Matching base44 exactly
  const routes = isAdminPage ? adminRoutes : dealerRoutes;
  const titlePrefix = isAdminPage ? 'Admin' : 'Dealer';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-gray-200 dark:border-gray-700 dark:bg-gray-900">
          <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Jeen Mata Impex</h2>
                <p className="text-xs text-red-600">{titlePrefix} Portal</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2 dark:bg-gray-900">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {routes.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 rounded-lg mb-1 ${
                          pathname === item.url ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' : 'dark:text-gray-300'
                        }`}
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                          <item.icon className="w-4 h-4" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 dark:border-gray-700 p-4 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {isDealerPage ? 'Dealer User' : 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="dark:text-gray-300">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuItem onClick={toggleTheme} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleLanguage} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <Globe className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'नेपाली' : 'English'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 md:hidden transition-colors duration-300">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Jeen Mata Impex</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
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