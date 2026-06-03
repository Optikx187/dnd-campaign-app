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

  const handleStatChange = (stat: keyof CharacterStats, value: number) => {
    setCharacter({
      ...character,
      stats: {
        ...character.stats,
        [stat]: Math.max(1, Math.min(20, value)),
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Character Sheet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter({ ...character, name: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter character name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Race</label>
            <select
              value={character.race}
              onChange={(e) => setCharacter({ ...character, race: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select race</option>
              {races.map((race) => (
                <option key={race} value={race}>{race}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={character.class}
              onChange={(e) => setCharacter({ ...character, class: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <input
              type="number"
              min="1"
              max="20"
              value={character.level}
              onChange={(e) => setCharacter({ ...character, level: parseInt(e.target.value) || 1 })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold mb-2">Ability Scores</h2>
          {Object.entries(character.stats).map(([stat, value]) => (
            <div key={stat} className="flex items-center space-x-3">
              <label className="w-32 text-sm font-medium capitalize">{stat}</label>
              <input
                type="number"
                min="1"
                max="20"
                value={value}
                onChange={(e) => handleStatChange(stat as keyof CharacterStats, parseInt(e.target.value) || 10)}
                className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
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
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Reset
        </button>
        <button
          onClick={saveCharacter}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Character
        </button>
      </div>
    </div>
  );
}
