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

type CharacterType = 'teq' | 'str' | 'agl' | 'int' | 'phy';
type ClassType = 'super' | 'extreme';
