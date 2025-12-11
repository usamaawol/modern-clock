import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

interface VoiceCommandResult {
  type: 'alarm' | 'task' | 'unknown';
  data?: {
    time?: string;
    title?: string;
  };
}

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recog = new SpeechRecognitionAPI() as SpeechRecognitionInstance;
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';
        setRecognition(recog);
      }
    }
  }, []);

  const parseCommand = (text: string): VoiceCommandResult => {
    const lowerText = text.toLowerCase();

    // Parse alarm commands
    const alarmMatch = lowerText.match(/set alarm (?:for )?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (alarmMatch) {
      let hours = parseInt(alarmMatch[1]);
      const minutes = alarmMatch[2] ? parseInt(alarmMatch[2]) : 0;
      const period = alarmMatch[3]?.toLowerCase();

      if (period === 'pm' && hours < 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;

      const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return { type: 'alarm', data: { time } };
    }

    // Parse task commands
    const taskMatch = lowerText.match(/add task[:\s]+(.+)/i);
    if (taskMatch) {
      return { type: 'task', data: { title: taskMatch[1].trim() } };
    }

    return { type: 'unknown' };
  };

  const startListening = useCallback(() => {
    if (!recognition) {
      toast.error('Speech recognition not supported');
      return;
    }

    setTranscript('');
    setIsListening(true);

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      setTranscript(result[0].transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast.error('Voice recognition failed');
    };

    recognition.start();
  }, [recognition]);

  const stopListening = useCallback((): VoiceCommandResult => {
    if (recognition && isListening) {
      recognition.stop();
    }
    setIsListening(false);
    return parseCommand(transcript);
  }, [recognition, isListening, transcript]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: !!recognition,
  };
};
