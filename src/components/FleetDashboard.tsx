import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TruckCard, TruckData } from './TruckCard';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Search, 
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface FleetStats {
  total: number;
  online: number;
  delayed: number;
  offline: number;
}

interface FleetDashboardProps {
  searchQuery?: string;
}

const mockTrucks: TruckData[] = [
  {
    id: "1",
    number: "MH12AB3456",
    status: "online",
    location: "Tumkur, Karnataka",
    destination: "Bangalore, Karnataka",
    eta: "3:20 PM",
    driver: { name: "Rajesh Kumar", phone: "+91-9876543210" },
    cargo: "Electronics - 15 tons",
    lastUpdate: "2 mins ago",
    distance: 75,
    speed: 65
  },
  {
    id: "2",
    number: "TN01XY1234",
    status: "delayed",
    location: "Krishnagiri, Tamil Nadu",
    destination: "Vijayawada, Andhra Pradesh",
    eta: "8:45 PM (Delayed)",
    driver: { name: "Suresh Babu", phone: "+91-9876543211" },
    cargo: "Textiles - 12 tons",
    lastUpdate: "15 mins ago",
    distance: 180,
    speed: 45
  },
  {
    id: "3",
    number: "KA03CD7890",
    status: "online",
    location: "Chitradurga, Karnataka",
    destination: "Hyderabad, Telangana",
    eta: "11:30 PM",
    driver: { name: "Venkat Reddy", phone: "+91-9876543212" },
    cargo: "Pharmaceuticals - 8 tons",
    lastUpdate: "5 mins ago",
    distance: 220,
    speed: 70
  },
  {
    id: "4",
    number: "AP09EF4567",
    status: "offline",
    location: "Anantapur, Andhra Pradesh",
    destination: "Chennai, Tamil Nadu",
    eta: "Unknown",
    driver: { name: "Prakash Singh", phone: "+91-9876543213" },
    cargo: "Steel Products - 20 tons",
    lastUpdate: "45 mins ago",
    distance: 0,
    speed: 0
  }
];

export const FleetDashboard: React.FC<FleetDashboardProps> = ({ searchQuery }) => {
  const [trucks, setTrucks] = useState<TruckData[]>(mockTrucks);
  const [searchTerm, setSearchTerm] = useState(searchQuery || '');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats: FleetStats = {
    total: trucks.length,
    online: trucks.filter(t => t.status === 'online').length,
    delayed: trucks.filter(t => t.status === 'delayed').length,
    offline: trucks.filter(t => t.status === 'offline').length
  };

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = truck.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || truck.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleCallDriver = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleReroute = (truckId: string) => {
    console.log(`Rerouting truck ${truckId}`);
    // Implement rerouting logic
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trucks</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time</p>
                <p className="text-2xl font-bold text-truck-online">{stats.online}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-truck-online" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold text-truck-delayed">{stats.delayed}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-truck-delayed" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-truck-offline">{stats.offline}</p>
              </div>
              <XCircle className="h-8 w-8 text-truck-offline" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Fleet Status
            </CardTitle>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by truck number, driver, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'online' ? 'success' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('online')}
                className="flex items-center gap-1"
              >
                {getStatusIcon('online')}
                On Time
              </Button>
              <Button
                variant={filterStatus === 'delayed' ? 'warning' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('delayed')}
                className="flex items-center gap-1"
              >
                {getStatusIcon('delayed')}
                Delayed
              </Button>
              <Button
                variant={filterStatus === 'offline' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('offline')}
                className="flex items-center gap-1"
              >
                {getStatusIcon('offline')}
                Offline
              </Button>
            </div>
          </div>

          {/* Truck Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTrucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onCallDriver={handleCallDriver}
                onReroute={handleReroute}
              />
            ))}
          </div>

          {filteredTrucks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No trucks found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetDashboard;