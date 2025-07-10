import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import VoiceInterface from '@/components/VoiceInterface';
import FleetDashboard from '@/components/FleetDashboard';
import RouteOptimizer from '@/components/RouteOptimizer';
import { 
  Truck,
  MessageSquare,
  Route,
  Settings,
  Bell,
  Activity,
  BarChart3,
  MapPin
} from 'lucide-react';

interface VoiceResponse {
  query: string;
  response: string;
  timestamp: Date;
  action?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<VoiceResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const { toast } = useToast();

  const processVoiceQuery = async (query: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let response = '';
    let action = '';
    
    // Simple query processing logic
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('where is truck') || lowerQuery.includes('location of truck')) {
      const truckMatch = query.match(/([A-Z]{2}\d{2}[A-Z]{2}\d{4})/i);
      if (truckMatch) {
        const truckNumber = truckMatch[1];
        response = `Truck ${truckNumber} is currently at Tumkur, Karnataka, heading to Bangalore. ETA is 3:20 PM. Driver contact: +91-9876543210`;
        setSearchQuery(truckNumber);
        setActiveTab('dashboard');
        action = 'truck-search';
      }
    } else if (lowerQuery.includes('which truck') && lowerQuery.includes('fastest')) {
      const destinationMatch = query.match(/reach\s+(\w+)/i);
      if (destinationMatch) {
        const destination = destinationMatch[1];
        response = `Truck KA05PQ9876 can reach ${destination} fastest with ETA of 2h 45m. Driver: Manoj Sharma. Shall I assign this route?`;
        setRouteDestination(destination);
        setActiveTab('routes');
        action = 'route-optimization';
      }
    } else if (lowerQuery.includes('driver') && lowerQuery.includes('contact')) {
      response = `Driver contact for the requested truck is +91-9876543210. Driver name: Rajesh Kumar. Currently online and available.`;
      action = 'driver-contact';
    } else if (lowerQuery.includes('reroute')) {
      response = `Rerouting instructions sent to the driver. New route via Anantapur bypass will save 30 minutes. Driver has been notified.`;
      action = 'rerouting';
    } else {
      response = `I understand you're asking about: "${query}". Let me help you with that. Please check the dashboard for detailed information.`;
      setActiveTab('dashboard');
    }

    const voiceResponse: VoiceResponse = {
      query,
      response,
      timestamp: new Date(),
      action
    };

    setVoiceHistory(prev => [voiceResponse, ...prev.slice(0, 4)]);
    
    // Speak the response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }

    toast({
      title: "Query Processed",
      description: `Found information for: ${query}`,
    });

    setIsProcessing(false);
  };

  const tabs = [
    { id: 'dashboard', label: 'Fleet Dashboard', icon: Truck },
    { id: 'routes', label: 'Route Optimizer', icon: Route },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">VoxFleet</h1>
                <p className="text-sm text-muted-foreground">Voice-Activated Freight Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Interface - Always Visible */}
          <div className="lg:col-span-1">
            <VoiceInterface
              onVoiceQuery={processVoiceQuery}
              isProcessing={isProcessing}
            />

            {/* Voice History */}
            {voiceHistory.length > 0 && (
              <Card className="mt-6 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Recent Queries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {voiceHistory.map((item, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-1">"{item.query}"</p>
                      <p className="text-xs text-muted-foreground mb-1">{item.response}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'outline'}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <FleetDashboard searchQuery={searchQuery} />
            )}

            {activeTab === 'routes' && (
              <RouteOptimizer destination={routeDestination} />
            )}

            {activeTab === 'analytics' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Fleet Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Advanced analytics and reporting features coming soon.
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold">Fuel Efficiency</h3>
                        <p className="text-2xl font-bold text-primary">12.5 km/L</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-semibold">On-Time Delivery</h3>
                        <p className="text-2xl font-bold text-truck-online">85%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Voice Settings</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Configure voice recognition and speech synthesis
                      </p>
                      <Button variant="outline" size="sm">Configure Voice</Button>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">API Integration</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Connect to fleet management systems and routing APIs
                      </p>
                      <Button variant="outline" size="sm">API Settings</Button>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Notifications</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Configure alerts and notification preferences
                      </p>
                      <Button variant="outline" size="sm">Notification Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
