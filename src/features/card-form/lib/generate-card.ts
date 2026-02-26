import { signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CardForm } from '~/src/features/card-form/model/card-form-interface';
import { Character } from '~/src/entities/card/model/character-type';
import { Passive } from '~/src/entities/card/model/passive-type';
import { SuperAttack } from '~/src/entities/card/model/super-attack-type';
import { PassiveConditionActivation, Category, Link } from '~/src/shared/model';

const DURATION_LOGO_MAP: Record<number, string> = {
  2: 'one.webp',
  3: 'infinite.webp',
  4: 'up.webp',
};

function getDurationLogo(value: number): string {
  return DURATION_LOGO_MAP[value] ?? '';
}

function buildCharacterInfo(
  data: ReturnType<FormGroup<CardForm>['getRawValue']>,
  categories: Category[],
  links: Link[],
): Character {
  return {
    type: data.type as 'teq' | 'str' | 'agl' | 'int' | 'phy',
    class: data.class as 'super' | 'extreme',
    stats: {
      attack: data.stats.attack ?? 0,
      defense: data.stats.defense ?? 0,
      hp: data.stats.hp ?? 0,
    },
    leaderSkill: data.leaderSkill,
    isLegendaryCharacter: data.isLegendary,
    categories: data.categories.categories.map(
      (value) => categories[value - 1]?.categoryName ?? '',
    ),
    links: data.links.links.map(
      (value) => links[value - 1]?.linkName ?? '',
    ),
    activeSkill: data.activeSkill.hasActiveSkill
      ? {
          activeSkillName: data.activeSkill.activeSkillName ?? '',
          activeSkillCondition: data.activeSkill.activeSkillCondition ?? '',
          activeSkillEffect: data.activeSkill.activeSkillEffect ?? '',
        }
      : null,
    domain: data.domain.hasDomain
      ? {
          domainName: data.domain.domainName ?? '',
          domainEffect: data.domain.domainEffect ?? '',
        }
      : null,
  };
}

function buildPassiveDetails(
  data: ReturnType<FormGroup<CardForm>['getRawValue']>,
  passiveConditionActivation: PassiveConditionActivation[],
): Passive {
  return {
    name: data.passive.passiveName ?? '',
    passive: data.passive.passivePart.map((part) => ({
      passiveConditionActivation: part.customPassiveConditionActivation
        ? part.customPassiveConditionActivation
        : passiveConditionActivation[part.passiveConditionActivation - 1]?.effect ?? '',
      effect: part.effect.map((e) => ({
        description: e.effectDescription,
        imageSrc: e.effectDuration > 1 ? getDurationLogo(e.effectDuration) : '',
      })),
    })),
  };
}

function buildSuperAttackInfo(
  data: ReturnType<FormGroup<CardForm>['getRawValue']>,
): SuperAttack {
  return {
    superAttackName: data.superAttack.superAttackName,
    superAttackEffect: data.superAttack.superAttackEffect,
    ultraSuperAttackName: data.superAttack.ultraSuperAttackName,
    ultraSuperAttackEffect: data.superAttack.ultraSuperAttackEffect,
  };
}

export function generateCard(
  form: FormGroup<CardForm>,
  categories: Category[],
  links: Link[],
  passiveConditionActivation: PassiveConditionActivation[],
) {
  const data = form.getRawValue();

  return {
    characterInfo: signal<Character | null>(buildCharacterInfo(data, categories, links)),
    passiveDetails: signal<Passive | null>(buildPassiveDetails(data, passiveConditionActivation)),
    superAttackInfo: signal<SuperAttack | null>(buildSuperAttackInfo(data)),
  };
}