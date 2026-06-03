import { useState } from 'react';

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface Character {
  name: string;
  race: string;
  class: string;
  level: number;
  stats: CharacterStats;
}

// D&D 5e Ability Score Improvement (ASI) levels
const ASI_LEVELS = [4, 8, 12, 16, 19];

// Calculate available ASI points based on level
const getAvailableASI = (level: number) => {
  return ASI_LEVELS.filter(l => l <= level).length;
};

// Calculate total stat points spent (above base 10)
const getStatPointsSpent = (stats: CharacterStats) => {
  return Object.values(stats).reduce((total, stat) => total + Math.max(0, stat - 10), 0);
};

export default function CharacterSheet() {
  const [character, setCharacter] = useState<Character>({
    name: '',
    race: '',
    class: '',
    level: 1,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
  });

  const races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Tiefling', 'Gnome', 'Half-Orc'];
  const classes = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger', 'Paladin', 'Barbarian', 'Bard', 'Druid', 'Monk', 'Sorcerer', 'Warlock'];

  const availableASI = getAvailableASI(character.level);
  const statPointsSpent = getStatPointsSpent(character.stats);
  const remainingPoints = availableASI * 2 - statPointsSpent;

  const handleStatChange = (stat: keyof CharacterStats, value: number) => {
    const newValue = Math.max(1, Math.min(20, value));
    const currentStat = character.stats[stat];
    const pointChange = newValue - currentStat;
    
    // Check if we have enough ASI points
    if (pointChange > 0 && remainingPoints < pointChange) {
      return; // Not enough points available
    }

    setCharacter({
      ...character,
      stats: {
        ...character.stats,
        [stat]: newValue,
      },
    });
  };

  const getModifier = (stat: number) => {
    return Math.floor((stat - 10) / 2);
  };

  const saveCharacter = () => {
    console.log('Saving character:', character);
    // TODO: Save to backend
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-purple-500/30">
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">⚔️</span>
        <h1 className="text-3xl font-bold text-white">Character Sheet</h1>
      </div>
      
      <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-gray-300">
          <span>Level {character.level}</span>
          <span>ASI Available: {availableASI} (at levels {ASI_LEVELS.join(', ')})</span>
          <span>Points Spent: {statPointsSpent}/20</span>
          <span className={remainingPoints >= 0 ? 'text-green-400' : 'text-red-400'}>
            Points Remaining: {remainingPoints}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              className="w-full p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter character name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Race</label>
            <select
              value={character.race}
              onChange={(e) => setCharacter({ ...character, race: e.target.value })}
              className="w-full p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select race</option>
              {races.map((race) => (
                <option key={race} value={race}>{race}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Class</label>
            <select
              value={character.class}
              onChange={(e) => setCharacter({ ...character, class: e.target.value })}
              className="w-full p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Level (1-20)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={character.level}
              onChange={(e) => setCharacter({ ...character, level: parseInt(e.target.value) || 1 })}
              className="w-full p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-2 text-white">Ability Scores</h2>
          {Object.entries(character.stats).map(([stat, value]) => (
            <div key={stat} className="flex items-center space-x-3">
              <label className="w-32 text-sm font-medium capitalize text-gray-300">{stat}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={value}
                onChange={(e) => handleStatChange(stat as keyof CharacterStats, parseInt(e.target.value) || 10)}
                className="w-20 p-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300 w-12">
                {getModifier(value) >= 0 ? '+' : ''}{getModifier(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setCharacter({
            name: '',
            race: '',
            class: '',
            level: 1,
            stats: {
              strength: 10,
              dexterity: 10,
              constitution: 10,
              intelligence: 10,
              wisdom: 10,
              charisma: 10,
            },
          })}
          className="px-4 py-2 border border-purple-500/30 rounded hover:bg-slate-700 text-white transition-all"
        >
          Reset
        </button>
        <button
          onClick={saveCharacter}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/50"
        >
          Save Character
        </button>
      </div>
    </div>
  );
}
