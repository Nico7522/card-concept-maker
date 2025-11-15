import { Character } from './character-interface';
import { Passive } from './passive-interface';
import { SuperAttack } from './super-attack-interface';

export interface Card {
  id?: string;
  creatorName: string;
  creatorId: string;
  cardName: string;
  characterInfo: Character;
  passiveDetails: Passive;
  superAttackInfo: SuperAttack;
}
