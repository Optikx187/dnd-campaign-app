import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DMChat from '../components/ui/DMChat';
import CharacterSheet from '../components/ui/CharacterSheet';

export default function CampaignPlay() {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'character' | 'rules'>('chat');

  useEffect(() => {
    const savedCampaign = localStorage.getItem('dnd-campaign');
    if (savedCampaign) {
      setCampaign(JSON.parse(savedCampaign));
    } else {
      navigate('/campaigns');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('dnd-campaign');
    navigate('/');
  };

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading campaign...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-sm border-b border-purple-500/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">🎲 {campaign.name}</h1>
            <span className="text-gray-400 text-sm">{campaign.description}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/campaigns')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all text-sm font-medium"
            >
              Campaigns
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/50 border-b border-purple-500/30 px-6">
        <div className="max-w-7xl mx-auto flex gap-2">
          <button
            onClick={() => setCurrentView('chat')}
            className={`px-6 py-3 font-medium transition-all ${
              currentView === 'chat'
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            💬 DM Chat
          </button>
          <button
            onClick={() => setCurrentView('character')}
            className={`px-6 py-3 font-medium transition-all ${
              currentView === 'character'
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            📋 Character Sheet
          </button>
          <button
            onClick={() => setCurrentView('rules')}
            className={`px-6 py-3 font-medium transition-all ${
              currentView === 'rules'
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            📖 Rules
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentView === 'chat' && <DMChat />}
        {currentView === 'character' && <CharacterSheet />}
        {currentView === 'rules' && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
              <h2 className="text-2xl font-bold text-white mb-4">📖 D&D Rules Reference</h2>
              <p className="text-gray-400">Rules reference coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
