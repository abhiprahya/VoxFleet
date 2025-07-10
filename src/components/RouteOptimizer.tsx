import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RerouteDialog } from './dialogs/RerouteDialog';
import { ShareDialog } from './dialogs/ShareDialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Route,
  MapPin,
  Clock,
  Truck,
  Navigation,
  Zap,
  AlertCircle,
  TrendingUp,
  Share2
} from 'lucide-react';

interface RouteOption {
  id: string;
  truckNumber: string;
  currentLocation: string;
  estimatedTime: string;
  distance: number;
  fuelCost: number;
  trafficStatus: 'low' | 'moderate' | 'high';
  routeDescription: string;
  driver: string;
  availability: 'available' | 'busy' | 'returning';
}

interface RouteOptimizerProps {
  destination?: string;
}

const mockRouteOptions: RouteOption[] = [
  {
    id: "1",
    truckNumber: "KA05PQ9876",
    currentLocation: "Electronic City, Bangalore",
    estimatedTime: "2h 45m",
    distance: 285,
    fuelCost: 2850,
    trafficStatus: 'low',
    routeDescription: "Via NH44 → Krishnagiri → Vellore",
    driver: "Manoj Sharma",
    availability: 'available'
  },
  {
    id: "2", 
    truckNumber: "TN11RS4567",
    currentLocation: "Hosur, Tamil Nadu",
    estimatedTime: "3h 15m",
    distance: 320,
    fuelCost: 3200,
    trafficStatus: 'moderate',
    routeDescription: "Via NH77 → Salem → Namakkal",
    driver: "Karthik Raman",
    availability: 'available'
  },
  {
    id: "3",
    truckNumber: "KA08UV7890",
    currentLocation: "Tumkur, Karnataka", 
    estimatedTime: "4h 20m",
    distance: 410,
    fuelCost: 4100,
    trafficStatus: 'high',
    routeDescription: "Via Chitradurga → Anantapur → Chittoor",
    driver: "Ravi Kumar",
    availability: 'returning'
  }
];

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ destination }) => {
  const [targetDestination, setTargetDestination] = useState(destination || '');
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>(mockRouteOptions);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showRerouteDialog, setShowRerouteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<RouteOption | null>(null);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!targetDestination.trim()) return;
    
    setIsOptimizing(true);
    // Simulate route optimization API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsOptimizing(false);
  };

  const getTrafficColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-truck-online text-white';
      case 'moderate': return 'bg-truck-delayed text-white';
      case 'high': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-truck-online text-white';
      case 'busy': return 'bg-truck-delayed text-white';
      case 'returning': return 'bg-truck-offline text-white';
      default: return 'bg-muted';
    }
  };

  const getTrafficIcon = (status: string) => {
    switch (status) {
      case 'low': return <TrendingUp className="h-4 w-4" />;
      case 'moderate': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card bg-gradient-dashboard">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Route Optimizer
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Enter destination (e.g., Vijayawada, Andhra Pradesh)"
                value={targetDestination}
                onChange={(e) => setTargetDestination(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleOptimize}
              disabled={isOptimizing || !targetDestination.trim()}
              className="flex items-center gap-2"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Find Best Route
                </>
              )}
            </Button>
          </div>

          {targetDestination && (
            <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Destination: {targetDestination}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {routeOptions.map((option, index) => (
              <Card key={option.id} className="shadow-card hover:shadow-active transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{option.truckNumber}</h3>
                        <p className="text-sm text-muted-foreground">Driver: {option.driver}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={getAvailabilityColor(option.availability)}>
                        {option.availability}
                      </Badge>
                      {index === 0 && (
                        <Badge className="bg-primary text-white">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Current Location</p>
                        <p className="text-sm font-medium">{option.currentLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">ETA</p>
                        <p className="text-sm font-medium text-primary">{option.estimatedTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="text-sm font-medium">{option.distance} km</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">Route</p>
                    <p className="text-sm">{option.routeDescription}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className={getTrafficColor(option.trafficStatus)}>
                          {getTrafficIcon(option.trafficStatus)}
                          Traffic: {option.trafficStatus}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Fuel Cost: </span>
                        <span className="font-medium">₹{option.fuelCost}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant={index === 0 ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedTruck(option);
                          setShowRerouteDialog(true);
                        }}
                      >
                        {index === 0 ? "Assign Route" : "Select"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTruck(option);
                          setShowShareDialog(true);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {routeOptions.length === 0 && !isOptimizing && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Enter a destination to find optimal routes.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTruck && (
        <>
          <RerouteDialog
            open={showRerouteDialog}
            onOpenChange={setShowRerouteDialog}
            truckNumber={selectedTruck.truckNumber}
            currentLocation={selectedTruck.currentLocation}
            destination={targetDestination || "Selected Destination"}
          />

          <ShareDialog
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            shareData={{
              title: `Route Optimization for ${selectedTruck.truckNumber}`,
              content: `Truck: ${selectedTruck.truckNumber}\nDriver: ${selectedTruck.driver}\nETA: ${selectedTruck.estimatedTime}\nDistance: ${selectedTruck.distance}km\nRoute: ${selectedTruck.routeDescription}`,
              url: `${window.location.origin}/#route-${selectedTruck.id}`
            }}
          />
        </>
      )}
    </div>
  );
};

export default RouteOptimizer;