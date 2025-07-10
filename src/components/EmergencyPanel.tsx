import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Truck,
  Users,
  MessageSquare,
  Siren,
  Shield,
  Zap
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  type: 'primary' | 'secondary' | 'emergency';
}

interface EmergencyIncident {
  id: string;
  truckNumber: string;
  type: 'accident' | 'breakdown' | 'medical' | 'security' | 'weather';
  location: string;
  status: 'active' | 'resolved' | 'pending';
  reportedAt: string;
  description: string;
}

const emergencyContacts: EmergencyContact[] = [
  { id: '1', name: 'Emergency Services', role: 'Police/Ambulance', phone: '112', type: 'emergency' },
  { id: '2', name: 'Highway Patrol', role: 'Traffic Police', phone: '1033', type: 'emergency' },
  { id: '3', name: 'Fleet Manager', role: 'Operations Head', phone: '+91-9876543200', type: 'primary' },
  { id: '4', name: 'Dispatch Center', role: '24/7 Support', phone: '+91-9876543201', type: 'primary' },
  { id: '5', name: 'Roadside Assistance', role: 'Breakdown Service', phone: '+91-9876543202', type: 'secondary' },
];

const recentIncidents: EmergencyIncident[] = [
  {
    id: '1',
    truckNumber: 'MH12AB3456',
    type: 'breakdown',
    location: 'NH48, Tumkur',
    status: 'pending',
    reportedAt: '2:30 PM',
    description: 'Engine overheating, driver safe'
  },
  {
    id: '2',
    truckNumber: 'TN01XY1234',
    type: 'weather',
    location: 'Krishnagiri, TN',
    status: 'active',
    reportedAt: '1:15 PM',
    description: 'Heavy rain, low visibility'
  }
];

export const EmergencyPanel: React.FC = () => {
  const [emergencyQuery, setEmergencyQuery] = useState('');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const { toast } = useToast();

  const handleEmergencyCall = (phone: string, name: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${phone}...`,
      variant: "destructive"
    });
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmergencyAlert = () => {
    setIsEmergencyMode(true);
    toast({
      title: "EMERGENCY ALERT ACTIVATED",
      description: "All supervisors and emergency contacts have been notified!",
      variant: "destructive"
    });
    
    // Auto-disable after 5 seconds for demo
    setTimeout(() => setIsEmergencyMode(false), 5000);
  };

  const handleQuickReport = (incidentType: string) => {
    toast({
      title: `${incidentType} Report Initiated`,
      description: "Emergency services and fleet manager have been notified.",
      variant: "destructive"
    });
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident': return <AlertTriangle className="h-4 w-4" />;
      case 'breakdown': return <Truck className="h-4 w-4" />;
      case 'medical': return <Users className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'weather': return <Zap className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'accident': return 'bg-destructive text-white';
      case 'breakdown': return 'bg-warning text-white';
      case 'medical': return 'bg-destructive text-white';
      case 'security': return 'bg-destructive text-white';
      case 'weather': return 'bg-orange-500 text-white';
      default: return 'bg-muted';
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-destructive text-white';
      case 'primary': return 'bg-primary text-white';
      case 'secondary': return 'bg-secondary text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert Button */}
      <Card className={`shadow-card ${isEmergencyMode ? 'border-destructive bg-destructive/5 animate-pulse' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Siren className="h-6 w-6" />
            Emergency Control Center
            {isEmergencyMode && <Badge className="bg-destructive text-white animate-pulse">ACTIVE ALERT</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEmergencyAlert}
              disabled={isEmergencyMode}
              className="h-16 text-lg font-semibold"
            >
              <AlertTriangle className="h-6 w-6 mr-2" />
              {isEmergencyMode ? 'ALERT ACTIVE' : 'EMERGENCY ALERT'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleQuickReport('Accident')}
              className="h-16"
            >
              <AlertTriangle className="h-5 w-5 mr-2" />
              Report Accident
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleQuickReport('Breakdown')}
              className="h-16"
            >
              <Truck className="h-5 w-5 mr-2" />
              Vehicle Breakdown
            </Button>
          </div>

          <div className="mt-4">
            <Input
              placeholder="Voice command: 'Emergency at NH48 Tumkur, truck MH12AB3456'"
              value={emergencyQuery}
              onChange={(e) => setEmergencyQuery(e.target.value)}
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{contact.name}</h4>
                    <Badge className={getContactColor(contact.type)}>
                      {contact.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.role}</p>
                  <p className="text-sm font-mono">{contact.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                  className="ml-2"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Active Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-4 border rounded-lg bg-muted/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getIncidentColor(incident.type)}>
                      {getIncidentIcon(incident.type)}
                      {incident.type}
                    </Badge>
                    <span className="font-medium">{incident.truckNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {incident.reportedAt}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {incident.location}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Driver
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Help
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {recentIncidents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active incidents reported.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPanel;