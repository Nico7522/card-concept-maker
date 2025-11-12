import { Passive } from './passive.type';
import { SuperAttack } from './super-attack.type';
import { Character } from './character.type';

export type Card = {
  id?: string;
  creatorName: string;
  creatorId: string;
  cardName: string;

  characterInfo: Character;
  passiveDetails: Passive;
  superAttackInfo: SuperAttack;
};
