import { useState, useEffect, useRef } from 'react';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  onSpeak: (text: string) => void;
}

export default function VoiceControls({ onTranscript, onSpeak }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsRecognitionSupported(true);
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [onTranscript, selectedVoice]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.volume = volume;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    onSpeak(text);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Voice Controls</h3>
      
      <div className="flex flex-wrap gap-3 items-center">
        {/* Voice Recognition */}
        <button
          onClick={toggleListening}
          disabled={!isRecognitionSupported}
          className={`px-4 py-2 rounded ${
            isListening 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isListening ? '🎤 Stop Listening' : '🎤 Start Listening'}
        </button>

        {/* Voice Synthesis */}
        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          🔇 Stop Speaking
        </button>

        {/* Voice Selection */}
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
          <span className="text-sm">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        {!isRecognitionSupported && (
          <p className="text-red-500">⚠️ Speech recognition not supported in this browser. Use Chrome or Edge for best results.</p>
        )}
        {isListening && <p className="text-blue-500">🎤 Listening...</p>}
        {isSpeaking && <p className="text-green-500">🔊 Speaking...</p>}
      </div>
    </div>
  );
}
