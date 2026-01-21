import { Character } from './character-type';
import { Passive } from './passive-type';
import { SuperAttack } from './super-attack-type';

export interface Card {
  id?: string;
  artwork?: string | null;
  creatorName: string;
  creatorId: string;
  cardName: string;
  characterInfo: Character;
  passiveDetails: Passive;
  superAttackInfo: SuperAttack;
}
