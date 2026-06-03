import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DMChat from '../components/ui/DMChat';
import CharacterSheet from '../components/ui/CharacterSheet';

export default function CampaignPlay() {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'character' | 'rules'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar - Roll20 style */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-800/95 backdrop-blur-sm border-r border-purple-500/30 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-purple-500/30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-purple-400 transition-colors"
          >
            {sidebarOpen ? '☰' : '☰'}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setCurrentView('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'chat'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <span className="text-xl">💬</span>
            {sidebarOpen && <span>DM Chat</span>}
          </button>

          <button
            onClick={() => setCurrentView('character')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'character'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <span className="text-xl">📋</span>
            {sidebarOpen && <span>Character Sheet</span>}
          </button>

          <button
            onClick={() => setCurrentView('rules')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentView === 'rules'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            <span className="text-xl">�</span>
            {sidebarOpen && <span>Rules</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-purple-500/30 space-y-2">
          <button
            onClick={() => navigate('/campaigns')}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              sidebarOpen ? 'bg-slate-700/50 text-white hover:bg-slate-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">📚</span>
            {sidebarOpen && <span>Campaigns</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              sidebarOpen ? 'bg-red-600/50 text-white hover:bg-red-600' : 'text-red-400'
            }`}
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Roll20 style */}
        <header className="bg-slate-800/95 backdrop-blur-sm border-b border-purple-500/30 px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">🎲 {campaign.name}</h1>
              {campaign.description && (
                <span className="text-gray-400 text-sm hidden md:inline">{campaign.description}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-slate-700/50 px-3 py-1 rounded-full text-sm text-gray-300">
                Session Active
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {currentView === 'chat' && <DMChat />}
          {currentView === 'character' && <CharacterSheet />}
          {currentView === 'rules' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="max-w-4xl mx-auto bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">📖 D&D Rules Reference</h2>
                <p className="text-gray-400">Rules reference coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
