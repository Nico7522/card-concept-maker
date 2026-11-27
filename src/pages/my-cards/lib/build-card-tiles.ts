import { Card } from '~/src/entities/card';

export interface CardTileStat {
  label: 'ATK' | 'DEF' | 'HP';
  value: number;
  // Bar width, relative to the user's best card for this stat
  percent: number;
}

export interface CardTile {
  card: Card;
  artworkUrl: string;
  rarityIcon: string;
  rarityLabel: 'LR' | 'UR';
  classIcon: string | null;
  typeLabel: string;
  typeColor: string;
  hasTransformation: boolean;
  stats: CardTileStat[];
  visibleCategories: string[];
  hiddenCategoriesCount: number;
}

const DEFAULT_ARTWORK = '/com_bg.png';
const VISIBLE_CATEGORIES = 3;
// A bar is never fully empty, so a low stat stays visible
const MIN_BAR_PERCENT = 3;

const TYPE_COLORS: Record<string, string> = {
  agl: 'var(--dokkan-agl)',
  teq: 'var(--dokkan-teq)',
  int: 'var(--dokkan-int)',
  str: 'var(--dokkan-str)',
  phy: 'var(--dokkan-phy)',
};

function toPercent(value: number, max: number): number {
  if (max <= 0) return MIN_BAR_PERCENT;
  return Math.max(MIN_BAR_PERCENT, Math.round((value / max) * 100));
}

/**
 * Prepares the data displayed by each tile of the My Cards page, so the
 * template stays free of logic.
 */
export function buildCardTiles(cards: Card[], apiUrl: string): CardTile[] {
  const maxOf = (pick: (card: Card) => number | undefined) =>
    Math.max(0, ...cards.map((card) => pick(card) ?? 0));
  const maxAttack = maxOf((card) => card.characterInfo?.stats.attack);
  const maxDefense = maxOf((card) => card.characterInfo?.stats.defense);
  const maxHp = maxOf((card) => card.characterInfo?.stats.hp);

  return cards.map((card) => {
    const info = card.characterInfo;
    const stats = info?.stats;
    const categories = info?.categories ?? [];
    const activeSkill = info?.activeSkill;
    const isLegendary = !!info?.isLegendaryCharacter;

    return {
      card,
      artworkUrl: card.artwork ? `${apiUrl}/${card.artwork}` : DEFAULT_ARTWORK,
      rarityIcon: isLegendary ? '/cha_rare_sm_lr.png' : '/cha_rare_sm_ur.png',
      rarityLabel: isLegendary ? 'LR' : 'UR',
      classIcon:
        info?.class && info?.type ? `/${info.class}${info.type}.png` : null,
      typeLabel:
        info?.class && info?.type
          ? `${info.class} ${info.type.toUpperCase()}`
          : '',
      typeColor: (info?.type && TYPE_COLORS[info.type]) || 'var(--logo-line-strong)',
      hasTransformation: !!(
        activeSkill?.transformedCardId || activeSkill?.baseCardId
      ),
      stats: [
        { label: 'ATK', value: stats?.attack ?? 0, percent: toPercent(stats?.attack ?? 0, maxAttack) },
        { label: 'DEF', value: stats?.defense ?? 0, percent: toPercent(stats?.defense ?? 0, maxDefense) },
        { label: 'HP', value: stats?.hp ?? 0, percent: toPercent(stats?.hp ?? 0, maxHp) },
      ],
      visibleCategories: categories.slice(0, VISIBLE_CATEGORIES),
      hiddenCategoriesCount: Math.max(0, categories.length - VISIBLE_CATEGORIES),
    };
  });
}
