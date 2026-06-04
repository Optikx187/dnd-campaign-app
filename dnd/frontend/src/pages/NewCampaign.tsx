import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NPC {
  name: string;
  personality: string;
  role: string;
}

export default function NewCampaign() {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [setting, setSetting] = useState('');
  const [mission, setMission] = useState('');
  const [npcs, setNpcs] = useState<NPC[]>([{ name: '', personality: '', role: '' }]);
  const [isLoading, setIsLoading] = useState(false);

  const addNPC = () => {
    setNpcs([...npcs, { name: '', personality: '', role: '' }]);
  };

  const removeNPC = (index: number) => {
    if (npcs.length > 1) {
      setNpcs(npcs.filter((_, i) => i !== index));
    }
  };

  const updateNPC = (index: number, field: keyof NPC, value: string) => {
    const updatedNPCs = [...npcs];
    updatedNPCs[index][field] = value;
    setNpcs(updatedNPCs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/orchestrate/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaignName,
          description,
          setting,
          mission,
          npcs: npcs.filter(npc => npc.name && npc.personality),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const campaign = data.campaign || data;
        localStorage.setItem('dnd-campaign', JSON.stringify(campaign));

        // Also add to campaigns list for the "Continue Campaign" flow
        const existingCampaigns = localStorage.getItem('dnd-campaigns');
        let campaignsList = [];
        if (existingCampaigns) {
          try {
            campaignsList = JSON.parse(existingCampaigns);
          } catch {
            campaignsList = [];
          }
        }
        campaignsList.push(campaign);
        localStorage.setItem('dnd-campaigns', JSON.stringify(campaignsList));

        navigate('/campaign/play');
      } else {
        alert('Failed to create campaign. Please try again.');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎮 Create New Campaign</h1>
          <p className="text-gray-400">Set up your adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <label htmlFor="campaignName" className="block text-sm font-medium text-gray-300 mb-2">
              Campaign Name *
            </label>
            <input
              id="campaignName"
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter a unique campaign name"
              required
            />
          </div>

          {/* Description */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Campaign Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Brief description of your campaign"
            />
          </div>

          {/* Setting */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <label htmlFor="setting" className="block text-sm font-medium text-gray-300 mb-2">
              World Setting *
            </label>
            <textarea
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Describe the world setting (e.g., medieval fantasy, steampunk, post-apocalyptic)"
              required
            />
          </div>

          {/* Mission */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <label htmlFor="mission" className="block text-sm font-medium text-gray-300 mb-2">
              Main Mission *
            </label>
            <textarea
              id="mission"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="What is the main mission or objective of this campaign?"
              required
            />
          </div>

          {/* NPCs */}
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Important NPCs</h3>
              <button
                type="button"
                onClick={addNPC}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
              >
                + Add NPC
              </button>
            </div>

            {npcs.map((npc, index) => (
              <div key={index} className="space-y-4 mb-4 p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                <div className="flex justify-between items-start">
                  <span className="text-purple-400 font-medium">NPC #{index + 1}</span>
                  {npcs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNPC(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={npc.name}
                    onChange={(e) => updateNPC(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="NPC name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Personality</label>
                  <textarea
                    value={npc.personality}
                    onChange={(e) => updateNPC(index, 'personality', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-600/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Describe their personality traits"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <input
                    type="text"
                    value={npc.role}
                    onChange={(e) => updateNPC(index, 'role', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Quest Giver, Villain, Ally"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="flex-1 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-purple-500/50"
            >
              {isLoading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
