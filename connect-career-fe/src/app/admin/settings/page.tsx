'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Database, Mail, Shield, Bell, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Connect Career',
    siteDescription: 'Professional job board and recruitment platform',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    jobApprovalRequired: true,
    companyVerificationRequired: false,
    maxJobPostsPerUser: 10,
    sessionTimeout: 30,
    allowGuestViewing: true,
    featuredJobsCount: 6,
    searchResultsPerPage: 20
  });

  const { toast } = useToast();

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Settings save logic would go here
    toast({
      title: "Settings saved",
      description: "Platform settings have been updated successfully."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure platform settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  {settings.maintenanceMode && (
                    <Badge variant="destructive">Site Under Maintenance</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="userRegistration"
                    checked={settings.userRegistration}
                    onCheckedChange={(checked) => updateSetting('userRegistration', checked)}
                  />
                  <Label htmlFor="userRegistration">Allow User Registration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowGuestViewing"
                    checked={settings.allowGuestViewing}
                    onCheckedChange={(checked) => updateSetting('allowGuestViewing', checked)}
                  />
                  <Label htmlFor="allowGuestViewing">Allow Guest Viewing</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="jobApprovalRequired"
                    checked={settings.jobApprovalRequired}
                    onCheckedChange={(checked) => updateSetting('jobApprovalRequired', checked)}
                  />
                  <Label htmlFor="jobApprovalRequired">Require Job Approval</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="companyVerificationRequired"
                    checked={settings.companyVerificationRequired}
                    onCheckedChange={(checked) => updateSetting('companyVerificationRequired', checked)}
                  />
                  <Label htmlFor="companyVerificationRequired">Require Company Verification</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                  <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                </div>
                <div>
                  <Label>SMTP Configuration</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input placeholder="SMTP Host" />
                    <Input placeholder="SMTP Port" type="number" />
                    <Input placeholder="Username" />
                    <Input placeholder="Password" type="password" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="featuredJobsCount">Featured Jobs Count</Label>
                  <Input
                    id="featuredJobsCount"
                    type="number"
                    value={settings.featuredJobsCount}
                    onChange={(e) => updateSetting('featuredJobsCount', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="searchResultsPerPage">Search Results Per Page</Label>
                  <Input
                    id="searchResultsPerPage"
                    type="number"
                    value={settings.searchResultsPerPage}
                    onChange={(e) => updateSetting('searchResultsPerPage', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxJobPostsPerUser">Max Job Posts Per User</Label>
                  <Input
                    id="maxJobPostsPerUser"
                    type="number"
                    value={settings.maxJobPostsPerUser}
                    onChange={(e) => updateSetting('maxJobPostsPerUser', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Platform Version</p>
                    <p className="text-lg font-semibold">v2.1.0</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Database Status</p>
                    <p className="text-lg font-semibold text-green-600">Connected</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Last Backup</p>
                    <p className="text-lg font-semibold">2024-01-15 10:30</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Server Status</p>
                    <p className="text-lg font-semibold text-green-600">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button variant="outline">Clear Cache</Button>
                  <Button variant="outline">Backup Database</Button>
                  <Button variant="outline">View Logs</Button>
                  <Button variant="destructive">Restart System</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={saveSettings} className="px-8">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}