import { CharacterType } from '../shared/models/character-type-type';
import { ClassType } from '../shared/models/class-type';

export type Character = {
  type: CharacterType;
  class: ClassType;
  stats: {
    attack: number;
    defense: number;
    hp: number;
  };
  leaderSkill: string;
  isLegendaryCharacter: boolean;
  categories: string[];
  links: string[];
  activeSkill: {
    activeSkillName: string;
    activeSkillCondition: string;
    activeSkillEffect: string;
  } | null;
} | null;
