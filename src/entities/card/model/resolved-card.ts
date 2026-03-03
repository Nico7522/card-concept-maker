import { Card } from './card-interface';

export interface ResolvedCard {
  baseCard: Card;
  transformedCard: Card | null;
  currentCard: Card;
}
