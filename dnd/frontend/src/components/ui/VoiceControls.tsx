import { useState, useEffect, useRef } from 'react';

interface VoiceControlsProps {
  onTranscript: (text: string) => void;
  currentInput?: string;
}

export default function VoiceControls({ onTranscript, currentInput }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Load available voices - filter for English only
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter(voice => 
        voice.lang.startsWith('en') || voice.lang.startsWith('en-')
      );
      
      // Sort to prioritize deeper/more dramatic voices
      const sortedVoices = englishVoices.sort((a, b) => {
        // Prioritize voices with "Male" or similar keywords for fantasy feel
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        const fantasyKeywords = ['male', 'dark', 'deep', 'david', 'daniel', 'james'];
        const aHasKeyword = fantasyKeywords.some(kw => aName.includes(kw));
        const bHasKeyword = fantasyKeywords.some(kw => bName.includes(kw));
        
        if (aHasKeyword && !bHasKeyword) return -1;
        if (!aHasKeyword && bHasKeyword) return 1;
        
        return a.name.localeCompare(b.name);
      });
      
      setVoices(sortedVoices);
      if (sortedVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(sortedVoices[0].name);
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
      // Clear any existing text before starting to listen
      if (currentInput && currentInput.trim()) {
        onTranscript(''); // Clear the input field
      }
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-purple-500/30 p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-white">🎙️ Voice Controls</h3>
      
      <div className="flex flex-wrap gap-3 items-center">
        {/* Voice Recognition */}
        <button
          onClick={toggleListening}
          disabled={!isRecognitionSupported}
          className={`px-4 py-2 rounded font-medium transition-all ${
            isListening 
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/50' 
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/50'
          } disabled:bg-slate-600 disabled:cursor-not-allowed`}
        >
          {isListening ? '🎤 Stop Listening' : '🎤 Start Listening'}
        </button>

        {/* Voice Synthesis */}
        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
        >
          🔇 Stop Speaking
        </button>

        {/* Voice Selection */}
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="px-3 py-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-300">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-400">
        {!isRecognitionSupported && (
          <p className="text-red-400">⚠️ Speech recognition not supported in this browser. Use Chrome or Edge for best results.</p>
        )}
        {isListening && <p className="text-blue-400">🎤 Listening...</p>}
        {isSpeaking && <p className="text-green-400">🔊 Speaking...</p>}
        {voices.length === 0 && (
          <p className="text-yellow-400">⚠️ No English voices available. Text-to-speech may not work properly.</p>
        )}
      </div>
    </div>
  );
}
