export type Character = {
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
