'use client'

import React, { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { Settings, Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    company_name: 'Jeen Mata Impex',
    tagline: 'Premium Import Solutions',
    contact_email: 'jeenmataimpex8@gmail.com',
    contact_phone: '+977-1-XXXXXXX',
    contact_address: 'Kathmandu, Nepal'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await SiteSettings.list();
        if (data.length > 0) {
          setSettings(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <Layout currentPageName="AdminSettings">
        <div className="p-6">Loading settings...</div>
      </Layout>
    );
  }

  return (
    <Layout currentPageName="AdminSettings">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Site Settings</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input 
                    id="company_name" 
                    value={settings.company_name} 
                    onChange={(e) => setSettings({...settings, company_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input 
                    id="tagline" 
                    value={settings.tagline} 
                    onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input 
                    id="contact_email" 
                    type="email"
                    value={settings.contact_email} 
                    onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input 
                    id="contact_phone" 
                    value={settings.contact_phone} 
                    onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">Contact Address</Label>
                <Input 
                  id="contact_address" 
                  value={settings.contact_address} 
                  onChange={(e) => setSettings({...settings, contact_address: e.target.value})}
                />
              </div>
              <div className="flex justify-end">
                <Button disabled={isSaving} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}