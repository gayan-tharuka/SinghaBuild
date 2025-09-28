import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Save, User, Bell, Shield, Palette, Plus } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(setSettings);
  }, []);

  useEffect(() => {
    if (settings['dark-mode']) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings['dark-mode']]);

  const handleColorChange = (color: string) => {
    const newSettings = { ...settings, 'theme-color': color };
    setSettings(newSettings);
    handleSave(newSettings);
  };

  useEffect(() => {
    const theme = settings['theme-color'];
    const body = document.body;
    body.classList.remove('theme-blue', 'theme-green', 'theme-purple');
    if (theme) {
      body.classList.add(`theme-${theme}`);
    }
  }, [settings['theme-color']]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    const newSettings = { ...settings, [id]: checked };
    setSettings(newSettings);
    handleSave(newSettings);
  };

  const handleSave = async (settingsToSave: any, showAlert = false) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsToSave),
      });
      if (showAlert) {
        alert("Settings saved!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    }
  };

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('logo', file);

      try {
        const response = await fetch("/api/upload-logo", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setSettings((prev: any) => ({ ...prev, logo: data.logoPath }));
      } catch (error) {
        console.error("Error uploading logo:", error);
        alert("Error uploading logo");
      }
    }
  };

  const [newUserForm, setNewUserForm] = useState({
    username: '',
    password: '',
    role: 'user',
  });

  const handleAddNewUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newUserForm),
      });

      if (response.ok) {
        alert("User created successfully!");
        setNewUserForm({ username: '', password: '', role: 'user' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground">
          Manage your application preferences and business settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <CardDescription>Update your business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Company Logo</Label>
              <Input id="logo-upload" type="file" onChange={handleLogoUpload} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input id="company-name" value={settings['company-name'] || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Address</Label>
              <Input id="company-address" value={settings['company-address'] || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-phone">Phone Number</Label>
              <Input id="company-phone" value={settings['company-phone'] || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input id="company-email" type="email" value={settings['company-email'] || ''} onChange={handleInputChange} />
            </div>
            <Button className="w-full" onClick={() => handleSave(settings, true)}>
              <Save className="w-4 h-4 mr-2" />
              Save Company Details
            </Button>
          </CardContent>
        </Card>

        {/* User Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>User Preferences</CardTitle>
            </div>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch id="email-notifications" checked={settings['email-notifications'] || false} onCheckedChange={(checked) => handleSwitchChange('email-notifications', checked)} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-foreground">
                  Switch to dark theme
                </p>
              </div>
              <Switch id="dark-mode" checked={settings['dark-mode'] || false} onCheckedChange={(checked) => handleSwitchChange('dark-mode', checked)} />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Drafts</Label>
                <p className="text-sm text-foreground">
                  Automatically save quotation drafts
                </p>
              </div>
              <Switch id="auto-save-drafts" checked={settings['auto-save-drafts'] || false} onCheckedChange={(checked) => handleSwitchChange('auto-save-drafts', checked)} />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>System Settings</CardTitle>
            </div>
            <CardDescription>Configure system behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-currency">Default Currency</Label>
              <Input id="default-currency" value={settings['default-currency'] || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" value={settings['tax-rate'] || ''} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotation-validity">Quotation Validity (Days)</Label>
              <Input id="quotation-validity" type="number" value={settings['quotation-validity'] || ''} onChange={handleInputChange} />
            </div>
            <Button className="w-full" onClick={() => handleSave(settings, true)}>
              <Save className="w-4 h-4 mr-2" />
              Save System Settings
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary cursor-pointer" onClick={() => handleColorChange('default')}></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-transparent hover:border-blue-500 cursor-pointer" onClick={() => handleColorChange('blue')}></div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-transparent hover:border-green-500 cursor-pointer" onClick={() => handleColorChange('green')}></div>
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-transparent hover:border-purple-500 cursor-pointer" onClick={() => handleColorChange('purple')}></div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-foreground">
                  Reduce spacing for more content
                </p>
              </div>
              <Switch id="compact-mode" checked={settings['compact-mode'] || false} onCheckedChange={(checked) => handleSwitchChange('compact-mode', checked)} />
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={handlePasswordChange}>
              <Save className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Add New User */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Add New User</CardTitle>
            </div>
            <CardDescription>Create new user accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">Username</Label>
              <Input
                id="new-username"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-role">Role</Label>
              <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleAddNewUser}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}