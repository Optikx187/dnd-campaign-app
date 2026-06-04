import { useState, useEffect } from 'react';
import VoiceControls from './VoiceControls';

interface Message {
  role: 'user' | 'assistant' | 'rules';
  content: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  currentScene: string;
  objectives: string[];
  completedObjectives: string[];
  isComplete: boolean;
  bossDefeated: boolean;
}

export default function DMChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'dm' | 'rules'>('dm');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const checkCampaignStatus = async () => {
    try {
      const savedCampaign = localStorage.getItem('dnd-campaign');
      if (savedCampaign) {
        try {
          setCampaign(JSON.parse(savedCampaign));
        } catch {
          localStorage.removeItem('dnd-campaign');
        }
      }

      const response = await fetch('http://localhost:3000/api/campaign/status');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      if (data.isActive && data.campaign) {
        setCampaign(data.campaign);
        localStorage.setItem('dnd-campaign', JSON.stringify(data.campaign));
      }
    } catch (error) {
      console.error('Error checking campaign status:', error);
    }
  };

  useEffect(() => {
    const loadCampaign = async () => {
      await checkCampaignStatus();
    };
    loadCampaign();
  }, []);

  // Save campaign to localStorage whenever it changes
  useEffect(() => {
    if (campaign) {
      localStorage.setItem('dnd-campaign', JSON.stringify(campaign));
    } else {
      localStorage.removeItem('dnd-campaign');
    }
  }, [campaign]);

  const startCampaign = async () => {
    if (!campaignName.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/campaign/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: campaignName, description: campaignDescription }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setCampaign(data);
      setShowCampaignModal(false);
      
      const dmMessage: Message = { role: 'assistant', content: data.currentScene };
      setMessages([dmMessage]);
    } catch (error) {
      console.error('Error starting campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to start campaign. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setError(null);
    try {
      let endpoint = mode === 'dm' ? '/api/ai/chat' : '/api/rules/ask';
      let body: any = mode === 'dm' 
        ? { prompt: messageToSend, model: 'llama3' }
        : { question: messageToSend };

      // If in campaign mode, use campaign advance instead
      if (mode === 'dm' && campaign && !campaign.isComplete) {
        endpoint = '/api/campaign/advance';
        body = { action: messageToSend };
      }

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (mode === 'dm' && campaign) {
        if (data.campaign) {
          setCampaign(data.campaign);
        }
        const content = data.scene || data.response;
        if (!content) {
          throw new Error('Received empty response from server');
        }
        const assistantMessage: Message = { role: 'assistant', content };
        setMessages((prev) => [...prev, assistantMessage]);
        speakMessage(content);
      } else {
        const content = mode === 'dm' ? data.response : data.answer;
        if (!content) {
          throw new Error('Received empty response from server');
        }
        const assistantMessage: Message = {
          role: mode === 'dm' ? 'assistant' : 'rules',
          content
        };
        setMessages((prev) => [...prev, assistantMessage]);
        speakMessage(content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorContent = error instanceof Error ? error.message : 'Failed to get response. Is the backend running?';
      const errorMessage: Message = { role: 'assistant', content: `Error: ${errorContent}` };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscript = (transcript: string) => {
    setInput(transcript);
  };


  const speakMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
    }
    utterance.rate = 0.9;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const resetCampaign = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/campaign/reset', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      setCampaign(null);
      setMessages([]);
      setError(null);
    } catch (error) {
      console.error('Error resetting campaign:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset campaign');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-6xl mx-auto">
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-red-300 text-sm">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-4">
            &times;
          </button>
        </div>
      )}
      <div className="flex gap-2 mb-4 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('dm')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'dm' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            🎭 DM Mode
          </button>
          <button
            onClick={() => setMode('rules')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'rules' 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            📜 Rules Mode
          </button>
        </div>
        {mode === 'dm' && (
          <div className="flex gap-2">
            {!campaign ? (
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-500/50 font-medium animate-pulse"
              >
                🎮 Start New Campaign
              </button>
            ) : (
              <>
                <div className="px-4 py-2 bg-purple-600/30 border border-purple-500/30 rounded-lg text-white">
                  {campaign.isComplete ? '🏆 Complete!' : `⚔️ ${campaign.name}`}
                </div>
                <button
                  onClick={resetCampaign}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/50 font-medium"
                >
                  Reset
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">🎮 Start New Campaign</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Campaign Name</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., The Lost Mines of Phandelver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Description (optional)</label>
                <textarea
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  className="w-full p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                  placeholder="Describe your campaign setting..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={startCampaign}
                  disabled={!campaignName.trim() || isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Starting...' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VoiceControls onTranscript={handleTranscript} currentInput={input} />
      
      {campaign && (
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">📋 {campaign.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{campaign.description}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-300">Objectives:</p>
                <ul className="text-sm text-gray-400 list-disc list-inside">
                  {campaign.objectives.map((obj, i) => (
                    <li key={i} className={campaign.completedObjectives.includes(obj) ? 'line-through text-green-400' : ''}>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {campaign.bossDefeated && (
              <div className="text-4xl">🏆</div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto border border-purple-500/30 rounded-lg p-4 mb-4 bg-slate-800/50 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <span className="text-4xl mb-4 block">{mode === 'dm' ? '🐉' : '📚'}</span>
            <p className="text-lg">
              {mode === 'dm' 
                ? campaign 
                  ? 'Continue your adventure...' 
                  : 'Begin your adventure with the Dungeon Master...' 
                : 'Ask questions about D&D 5e rules...'}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-purple-600/30 ml-8 border border-purple-500/30' 
                  : msg.role === 'rules'
                  ? 'bg-blue-600/30 mr-8 border border-blue-500/30'
                  : 'bg-green-600/30 mr-8 border border-green-500/30'
              }`}
            >
              <strong className="text-white">
                {msg.role === 'user' 
                  ? '🧙 You' 
                  : msg.role === 'rules'
                  ? '📜 Rules Lawyer'
                  : '🐉 DM'}:
              </strong>
              <p className="mt-2 text-gray-200 whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-center text-gray-400 py-4">
            <span className="text-2xl animate-pulse">{mode === 'dm' ? '🐉' : '📚'}</span>
            <p className="mt-2">
              {mode === 'dm' ? 'The Dungeon Master is contemplating...' : 'Consulting ancient tomes...'}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={mode === 'dm' ? (campaign ? 'What do you do?' : 'Speak to the Dungeon Master...') : 'Ask about the rules...'}
          className="flex-1 p-3 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
