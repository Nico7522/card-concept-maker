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
  activeSkill: ActiveSkill;
  domain: {
    domainName: string;
    domainEffect: string;
  } | null;
} | null;

export type ActiveSkill = {
  activeSkillName: string;
  activeSkillCondition: string;
  activeSkillEffect: string;
  transformedCardId?: string;
  baseCardId?: string;
} | null;
type CharacterType = 'teq' | 'str' | 'agl' | 'int' | 'phy';
type ClassType = 'super' | 'extreme';
