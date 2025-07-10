import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Mic, 
  MapPin, 
  Hash, 
  Truck,
  Users,
  Tag,
  Filter,
  Volume2
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'truck' | 'driver' | 'location' | 'group';
  title: string;
  subtitle: string;
  details: string;
  status?: string;
}

interface VoiceSearchPanelProps {
  onSearchResult?: (results: SearchResult[]) => void;
}

export const VoiceSearchPanel: React.FC<VoiceSearchPanelProps> = ({
  onSearchResult
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'truck' | 'driver' | 'location' | 'group'>('all');
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  // Mock search data
  const mockData: SearchResult[] = [
    { id: '1', type: 'truck', title: 'MH12AB3456', subtitle: 'Rajesh Kumar', details: 'Tumkur → Bangalore', status: 'online' },
    { id: '2', type: 'truck', title: 'TN01XY1234', subtitle: 'Suresh Babu', details: 'Chennai → Vijayawada', status: 'delayed' },
    { id: '3', type: 'truck', title: 'KA03CD7890', subtitle: 'Venkat Reddy', details: 'Chitradurga → Hyderabad', status: 'online' },
    { id: '4', type: 'driver', title: 'Manoj Sharma', subtitle: 'KA05PQ9876', details: '+91-9876543210', status: 'available' },
    { id: '5', type: 'driver', title: 'Karthik Raman', subtitle: 'TN11RS4567', details: '+91-9876543211', status: 'busy' },
    { id: '6', type: 'location', title: 'Tumkur, Karnataka', subtitle: '560001', details: '3 trucks nearby', status: 'active' },
    { id: '7', type: 'location', title: 'Bangalore, Karnataka', subtitle: '560001-560100', details: 'Main hub, 12 trucks', status: 'active' },
    { id: '8', type: 'group', title: 'South Zone Fleet', subtitle: 'Karnataka-Tamil Nadu', details: '15 active trucks', status: 'operational' },
    { id: '9', type: 'group', title: 'Express Delivery', subtitle: 'Priority shipments', details: '8 trucks assigned', status: 'operational' },
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-IN';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        performSearch(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Search Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startVoiceSearch = () => {
    if (recognition) {
      recognition.start();
      toast({
        title: "Voice Search Active",
        description: "Speak your search query now...",
      });
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    let filtered = mockData.filter(item => {
      const matchesType = searchType === 'all' || item.type === searchType;
      const matchesQuery = 
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.details.toLowerCase().includes(lowerQuery);
      
      return matchesType && matchesQuery;
    });

    // Smart search for specific patterns
    if (lowerQuery.match(/\d{6}/)) { // Pincode pattern
      filtered = mockData.filter(item => item.type === 'location' && item.subtitle.includes(lowerQuery));
    } else if (lowerQuery.match(/[A-Z]{2}\d{2}[A-Z]{2}\d{4}/i)) { // Vehicle number pattern
      filtered = mockData.filter(item => item.type === 'truck' && item.title.toLowerCase().includes(lowerQuery));
    }

    setSearchResults(filtered);
    
    if (onSearchResult) {
      onSearchResult(filtered);
    }

    if (filtered.length > 0) {
      speakSearchResults(filtered.length, query);
    } else {
      speakSearchResults(0, query);
    }
  };

  const speakSearchResults = (count: number, query: string) => {
    if ('speechSynthesis' in window) {
      const message = count > 0 
        ? `Found ${count} result${count > 1 ? 's' : ''} for ${query}` 
        : `No results found for ${query}`;
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'truck': return <Truck className="h-4 w-4" />;
      case 'driver': return <Users className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'group': return <Tag className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
      case 'available':
      case 'active':
      case 'operational':
        return 'bg-truck-online text-white';
      case 'delayed':
      case 'busy':
        return 'bg-truck-delayed text-white';
      case 'offline':
        return 'bg-truck-offline text-white';
      default:
        return 'bg-muted';
    }
  };

  const searchTypes = [
    { key: 'all', label: 'All', icon: Search },
    { key: 'truck', label: 'Trucks', icon: Truck },
    { key: 'driver', label: 'Drivers', icon: Users },
    { key: 'location', label: 'Locations', icon: MapPin },
    { key: 'group', label: 'Groups', icon: Tag }
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Advanced Fleet Search
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input with Voice */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by truck number, driver, pincode, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                performSearch(e.target.value);
              }}
              className="pl-10"
            />
          </div>
          <Button
            variant={isListening ? "voice-active" : "voice"}
            size="icon"
            onClick={startVoiceSearch}
            disabled={isListening}
          >
            {isListening ? (
              <div className="animate-pulse">
                <Mic className="h-4 w-4" />
              </div>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Type Filters */}
        <div className="flex flex-wrap gap-2">
          {searchTypes.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={searchType === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSearchType(key as any);
                if (searchQuery) performSearch(searchQuery);
              }}
              className="flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>

        {/* Search Examples */}
        {!searchQuery && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Voice search examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
              <div>"Find truck MH12AB3456"</div>
              <div>"Show drivers in Bangalore"</div>
              <div>"Trucks near pincode 560001"</div>
              <div>"South zone fleet status"</div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Search Results ({searchResults.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakSearchResults(searchResults.length, searchQuery)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    toast({
                      title: `Selected ${result.title}`,
                      description: result.details,
                    });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        {getResultIcon(result.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{result.title}</h4>
                        <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                        <p className="text-xs text-muted-foreground">{result.details}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      {result.status && (
                        <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                          {result.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching by truck number, driver name, or location
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSearchPanel;