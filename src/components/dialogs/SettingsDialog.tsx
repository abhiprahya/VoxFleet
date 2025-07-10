import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings, Volume2, Bell, Key, Globe, MapPin } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en-US',
    voiceSpeed: '0.9',
    voiceEnabled: true,
    autoPlay: true
  });
  
  const [apiSettings, setApiSettings] = useState({
    mapboxToken: '',
    googleMapsToken: '',
    weatherApiKey: '',
    smsApiKey: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    emergencyAlerts: true,
    routeUpdates: true,
    delayAlerts: true
  });

  const [organizationSettings, setOrganizationSettings] = useState({
    orgName: 'VoxFleet Logistics',
    zone: 'South India',
    state: 'Karnataka',
    tier: 'Tier 1',
    description: 'Premium freight management services',
    tags: 'logistics, freight, transport, AI'
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
    onOpenChange(false);
  };

  const handleVoiceTest = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "VoxFleet voice settings configured successfully. Voice recognition and synthesis are working properly."
      );
      utterance.lang = voiceSettings.language;
      utterance.rate = parseFloat(voiceSettings.voiceSpeed);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System Settings
          </DialogTitle>
          <DialogDescription>
            Configure your VoxFleet system preferences and integrations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="organization">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Voice Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-enabled">Enable Voice Recognition</Label>
                <Switch
                  id="voice-enabled"
                  checked={voiceSettings.voiceEnabled}
                  onCheckedChange={(checked) => 
                    setVoiceSettings(prev => ({ ...prev, voiceEnabled: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Voice Language</Label>
                <Select 
                  value={voiceSettings.language} 
                  onValueChange={(value) => 
                    setVoiceSettings(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-IN">English (India)</SelectItem>
                    <SelectItem value="hi-IN">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="te-IN">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="ta-IN">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="bn-IN">বাংলা (Bengali)</SelectItem>
                    <SelectItem value="ml-IN">മലയാളം (Malayalam)</SelectItem>
                    <SelectItem value="gu-IN">ગુજરાતી (Gujarati)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-speed">Voice Speed: {voiceSettings.voiceSpeed}</Label>
                <input
                  type="range"
                  id="voice-speed"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSettings.voiceSpeed}
                  onChange={(e) => 
                    setVoiceSettings(prev => ({ ...prev, voiceSpeed: e.target.value }))
                  }
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-play">Auto-play Voice Responses</Label>
                <Switch
                  id="auto-play"
                  checked={voiceSettings.autoPlay}
                  onCheckedChange={(checked) => 
                    setVoiceSettings(prev => ({ ...prev, autoPlay: checked }))
                  }
                />
              </div>

              <Button onClick={handleVoiceTest} variant="outline" className="w-full">
                <Volume2 className="h-4 w-4 mr-2" />
                Test Voice Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">API Integration</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapbox">Mapbox Access Token</Label>
                <Input
                  id="mapbox"
                  type="password"
                  placeholder="pk.eyJ1..."
                  value={apiSettings.mapboxToken}
                  onChange={(e) => 
                    setApiSettings(prev => ({ ...prev, mapboxToken: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-maps">Google Maps API Key</Label>
                <Input
                  id="google-maps"
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiSettings.googleMapsToken}
                  onChange={(e) => 
                    setApiSettings(prev => ({ ...prev, googleMapsToken: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weather">Weather API Key</Label>
                <Input
                  id="weather"
                  type="password"
                  placeholder="OpenWeatherMap API key"
                  value={apiSettings.weatherApiKey}
                  onChange={(e) => 
                    setApiSettings(prev => ({ ...prev, weatherApiKey: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms">SMS API Key</Label>
                <Input
                  id="sms"
                  type="password"
                  placeholder="Twilio or similar SMS service API key"
                  value={apiSettings.smsApiKey}
                  onChange={(e) => 
                    setApiSettings(prev => ({ ...prev, smsApiKey: e.target.value }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Notification Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <Switch
                  id="email-notif"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <Switch
                  id="sms-notif"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif">Push Notifications</Label>
                <Switch
                  id="push-notif"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                <Switch
                  id="emergency-alerts"
                  checked={notificationSettings.emergencyAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, emergencyAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="route-updates">Route Updates</Label>
                <Switch
                  id="route-updates"
                  checked={notificationSettings.routeUpdates}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, routeUpdates: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="delay-alerts">Delay Alerts</Label>
                <Switch
                  id="delay-alerts"
                  checked={notificationSettings.delayAlerts}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, delayAlerts: checked }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="organization" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Organization Profile</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={organizationSettings.orgName}
                  onChange={(e) => 
                    setOrganizationSettings(prev => ({ ...prev, orgName: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Select 
                    value={organizationSettings.zone} 
                    onValueChange={(value) => 
                      setOrganizationSettings(prev => ({ ...prev, zone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North India">North India</SelectItem>
                      <SelectItem value="South India">South India</SelectItem>
                      <SelectItem value="East India">East India</SelectItem>
                      <SelectItem value="West India">West India</SelectItem>
                      <SelectItem value="Central India">Central India</SelectItem>
                      <SelectItem value="Northeast India">Northeast India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={organizationSettings.state}
                    onChange={(e) => 
                      setOrganizationSettings(prev => ({ ...prev, state: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier">City Tier</Label>
                <Select 
                  value={organizationSettings.tier} 
                  onValueChange={(value) => 
                    setOrganizationSettings(prev => ({ ...prev, tier: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier 1">Tier 1 (Metro Cities)</SelectItem>
                    <SelectItem value="Tier 2">Tier 2 (Major Cities)</SelectItem>
                    <SelectItem value="Tier 3">Tier 3 (Smaller Cities)</SelectItem>
                    <SelectItem value="Rural">Rural Areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Organization Description</Label>
                <Input
                  id="description"
                  value={organizationSettings.description}
                  onChange={(e) => 
                    setOrganizationSettings(prev => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="logistics, freight, transport, AI"
                  value={organizationSettings.tags}
                  onChange={(e) => 
                    setOrganizationSettings(prev => ({ ...prev, tags: e.target.value }))
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Settings className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};