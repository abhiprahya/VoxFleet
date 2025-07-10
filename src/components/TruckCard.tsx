import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, User, Phone, Navigation } from 'lucide-react';

export interface TruckData {
  id: string;
  number: string;
  status: 'online' | 'delayed' | 'offline';
  location: string;
  destination: string;
  eta: string;
  driver: {
    name: string;
    phone: string;
  };
  cargo: string;
  lastUpdate: string;
  distance: number;
  speed: number;
}

interface TruckCardProps {
  truck: TruckData;
  onCallDriver: (phone: string) => void;
  onReroute: (truckId: string) => void;
}

export const TruckCard: React.FC<TruckCardProps> = ({ 
  truck, 
  onCallDriver, 
  onReroute 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-truck-online';
      case 'delayed': return 'bg-truck-delayed';
      case 'offline': return 'bg-truck-offline';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'On Time';
      case 'delayed': return 'Delayed';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="shadow-card hover:shadow-active transition-all duration-300 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            {truck.number}
          </CardTitle>
          <Badge className={`${getStatusColor(truck.status)} text-white`}>
            {getStatusText(truck.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Current:</span>
            </div>
            <p className="text-sm font-medium">{truck.location}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Destination:</span>
            </div>
            <p className="text-sm font-medium">{truck.destination}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">ETA:</span>
            </div>
            <p className="text-sm font-medium text-primary">{truck.eta}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Driver:</span>
            </div>
            <p className="text-sm font-medium">{truck.driver.name}</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground mb-1">Cargo</p>
          <p className="text-sm font-medium">{truck.cargo}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Distance: {truck.distance} km</div>
          <div>Speed: {truck.speed} km/h</div>
          <div className="col-span-2">Last update: {truck.lastUpdate}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCallDriver(truck.driver.phone)}
            className="flex-1 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Call Driver
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => onReroute(truck.id)}
            className="flex-1"
          >
            Reroute
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TruckCard;