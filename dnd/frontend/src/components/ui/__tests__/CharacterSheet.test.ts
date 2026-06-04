import { describe, it, expect } from 'vitest';
import {
  ASI_LEVELS,
  getAvailableASI,
  getStatPointsSpent,
  getModifier,
  type CharacterStats,
} from '../CharacterSheet';

describe('ASI_LEVELS', () => {
  it('contains the correct D&D 5e ASI levels', () => {
    expect(ASI_LEVELS).toEqual([4, 8, 12, 16, 19]);
  });
});

describe('getAvailableASI', () => {
  it('returns 0 for level 1', () => {
    expect(getAvailableASI(1)).toBe(0);
  });

  it('returns 0 for level 3 (just before first ASI)', () => {
    expect(getAvailableASI(3)).toBe(0);
  });

  it('returns 1 at level 4 (first ASI)', () => {
    expect(getAvailableASI(4)).toBe(1);
  });

  it('returns 2 at level 8', () => {
    expect(getAvailableASI(8)).toBe(2);
  });

  it('returns 3 at level 12', () => {
    expect(getAvailableASI(12)).toBe(3);
  });

  it('returns 4 at level 16', () => {
    expect(getAvailableASI(16)).toBe(4);
  });

  it('returns 5 at level 19 (max ASIs)', () => {
    expect(getAvailableASI(19)).toBe(5);
  });

  it('returns 5 at level 20', () => {
    expect(getAvailableASI(20)).toBe(5);
  });

  it('returns correct count between ASI levels', () => {
    expect(getAvailableASI(5)).toBe(1);
    expect(getAvailableASI(10)).toBe(2);
    expect(getAvailableASI(15)).toBe(3);
  });
});

describe('getStatPointsSpent', () => {
  it('returns 0 when all stats are at base 10', () => {
    const stats: CharacterStats = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    };
    expect(getStatPointsSpent(stats)).toBe(0);
  });

  it('counts points above 10', () => {
    const stats: CharacterStats = {
      strength: 12,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    };
    expect(getStatPointsSpent(stats)).toBe(2);
  });

  it('ignores stats below 10', () => {
    const stats: CharacterStats = {
      strength: 8,
      dexterity: 8,
      constitution: 8,
      intelligence: 8,
      wisdom: 8,
      charisma: 8,
    };
    expect(getStatPointsSpent(stats)).toBe(0);
  });

  it('sums points across all stats above 10', () => {
    const stats: CharacterStats = {
      strength: 14,
      dexterity: 12,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    };
    expect(getStatPointsSpent(stats)).toBe(6);
  });

  it('handles all stats at max 20', () => {
    const stats: CharacterStats = {
      strength: 20,
      dexterity: 20,
      constitution: 20,
      intelligence: 20,
      wisdom: 20,
      charisma: 20,
    };
    expect(getStatPointsSpent(stats)).toBe(60);
  });
});

describe('getModifier', () => {
  it('returns 0 for stat 10', () => {
    expect(getModifier(10)).toBe(0);
  });

  it('returns 0 for stat 11', () => {
    expect(getModifier(11)).toBe(0);
  });

  it('returns +1 for stat 12', () => {
    expect(getModifier(12)).toBe(1);
  });

  it('returns +5 for stat 20', () => {
    expect(getModifier(20)).toBe(5);
  });

  it('returns -1 for stat 8', () => {
    expect(getModifier(8)).toBe(-1);
  });

  it('returns -1 for stat 9', () => {
    expect(getModifier(9)).toBe(-1);
  });

  it('returns -5 for stat 1', () => {
    expect(getModifier(1)).toBe(-5);
  });

  it('follows the D&D formula: floor((stat - 10) / 2)', () => {
    for (let stat = 1; stat <= 20; stat++) {
      expect(getModifier(stat)).toBe(Math.floor((stat - 10) / 2));
    }
  });
});
