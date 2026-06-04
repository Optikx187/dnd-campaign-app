import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CampaignSelection() {
  const navigate = useNavigate();
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  const handleStartNew = () => {
    setShowNewCampaign(true);
  };

  const handleContinue = () => {
    navigate('/campaigns/list');
  };

  if (showNewCampaign) {
    navigate('/campaigns/new');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/30 p-12 w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🎲 Campaign Selection</h1>
          <p className="text-gray-400 text-lg">D&D Companion - Choose your adventure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Start New Campaign Card */}
          <button
            onClick={handleStartNew}
            className="group bg-gradient-to-br from-green-600/20 to-green-800/20 border-2 border-green-500/50 rounded-xl p-8 hover:border-green-400 hover:from-green-600/30 hover:to-green-800/30 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
              <h2 className="text-2xl font-bold text-white mb-2">Start New Campaign</h2>
              <p className="text-gray-400 text-sm">Create a brand new adventure</p>
            </div>
          </button>

          {/* Continue Campaign Card */}
          <button
            onClick={handleContinue}
            className="group bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-2 border-blue-500/50 rounded-xl p-8 hover:border-blue-400 hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📚</div>
              <h2 className="text-2xl font-bold text-white mb-2">Continue Campaign</h2>
              <p className="text-gray-400 text-sm">Resume an existing adventure</p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
