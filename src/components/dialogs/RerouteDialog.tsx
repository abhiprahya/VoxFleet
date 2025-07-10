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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Route, Clock, AlertTriangle } from 'lucide-react';

interface RerouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  truckNumber: string;
  currentLocation: string;
  destination: string;
}

export const RerouteDialog: React.FC<RerouteDialogProps> = ({
  open,
  onOpenChange,
  truckNumber,
  currentLocation,
  destination
}) => {
  const [rerouteReason, setRerouteReason] = useState('');
  const [alternateRoute, setAlternateRoute] = useState('');
  const [priority, setPriority] = useState('normal');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Reroute Successful",
      description: `New route instructions sent to driver of ${truckNumber}. Driver will be notified via SMS and app.`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setRerouteReason('');
    setAlternateRoute('');
    setPriority('normal');
    setAdditionalInstructions('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Reroute Truck {truckNumber}
          </DialogTitle>
          <DialogDescription>
            Send new routing instructions to the driver
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Route Info */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">From:</span> {currentLocation}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">To:</span> {destination}
            </div>
          </div>

          {/* Reroute Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Reroute</Label>
            <Select value={rerouteReason} onValueChange={setRerouteReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="traffic">Heavy Traffic</SelectItem>
                <SelectItem value="accident">Road Accident</SelectItem>
                <SelectItem value="weather">Weather Conditions</SelectItem>
                <SelectItem value="roadwork">Road Construction</SelectItem>
                <SelectItem value="fuel">Fuel Station Stop</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="optimization">Route Optimization</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alternate Route */}
          <div className="space-y-2">
            <Label htmlFor="route">New Route Instructions</Label>
            <Input
              id="route"
              placeholder="e.g., Via Anantapur bypass, NH44"
              value={alternateRoute}
              onChange={(e) => setAlternateRoute(e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Driver can continue current route if needed</SelectItem>
                <SelectItem value="normal">Normal - Change route when convenient</SelectItem>
                <SelectItem value="high">High - Change route immediately</SelectItem>
                <SelectItem value="emergency">Emergency - Stop and await instructions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="Any additional instructions for the driver..."
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              rows={3}
            />
          </div>

          {priority === 'emergency' && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">
                Emergency reroute will immediately notify driver and supervisor
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!rerouteReason || !alternateRoute || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Route className="h-4 w-4 mr-2" />
                Send Reroute
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};