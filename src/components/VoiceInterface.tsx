import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceInterfaceProps {
  onVoiceQuery: (query: string) => void;
  isProcessing?: boolean;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onVoiceQuery, 
  isProcessing = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const { toast } = useToast();

  const languages = {
    'en-US': 'English',
    'hi-IN': 'हिंदी',
    'te-IN': 'తెలుగు',
    'ta-IN': 'தமிழ்',
    'bn-IN': 'বাংলা'
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLanguage;

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceQuery(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [currentLanguage, onVoiceQuery, toast]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleLanguage = () => {
    const languageKeys = Object.keys(languages);
    const currentIndex = languageKeys.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languageKeys.length;
    setCurrentLanguage(languageKeys[nextIndex]);
  };

  return (
    <Card className="bg-gradient-dashboard border-none shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold text-primary">VoxFleet Assistant</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              {languages[currentLanguage as keyof typeof languages]}
            </Button>
          </div>

          <div className="relative">
            <Button
              variant={isListening ? "voice-active" : "voice"}
              size="voice"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className="relative"
            >
              {isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-voice-listening animate-ping"></div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isListening 
                ? "Listening... Speak your query now" 
                : isProcessing 
                ? "Processing your request..." 
                : "Click to start voice command"
              }
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
              <span>"Where is truck MH12AB3456?"</span>
              <span>"Which truck can reach Delhi fastest?"</span>
              <span>"Get driver contact for truck TN01XY1234"</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => speakResponse("VoxFleet voice assistant is ready to help you with fleet management queries.")}
            className="flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Test Voice Output
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInterface;