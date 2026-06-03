import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function CampaignList() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCampaigns = async () => {
    try {
      // For now, load from localStorage. In production, this would come from the database
      const savedCampaigns = localStorage.getItem('dnd-campaigns');
      if (savedCampaigns) {
        setCampaigns(JSON.parse(savedCampaigns));
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleSelectCampaign = (campaign: Campaign) => {
    localStorage.setItem('dnd-campaign', JSON.stringify(campaign));
    navigate('/campaign/play');
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
      setCampaigns(updatedCampaigns);
      localStorage.setItem('dnd-campaigns', JSON.stringify(updatedCampaigns));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 Your Campaigns</h1>
          <p className="text-gray-400">Select a campaign to continue</p>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Campaigns Yet</h2>
            <p className="text-gray-400 mb-6">You haven't created any campaigns yet.</p>
            <button
              onClick={() => navigate('/campaigns/new')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium shadow-lg shadow-purple-500/50"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 hover:border-purple-400 transition-all shadow-lg hover:shadow-purple-500/30"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>

                {campaign.description && (
                  <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                </div>

                <button
                  onClick={() => handleSelectCampaign(campaign)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/campaigns/new')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-lg shadow-green-500/50"
          >
            + New Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
