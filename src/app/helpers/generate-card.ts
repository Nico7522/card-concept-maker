import { signal } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { categories } from '../select-options/categories';
import { Links } from '../select-options/links';
import { passiveConditionActivation } from '../select-options/passive-condition-activation';
import getDurationLogo from './get-duration-logo';
import { CardForm } from '~/src/widgets/card-form/model/card-form-interface';
import { Character } from '~/src/shared/model/character-interface';
import { Passive } from '~/src/shared/model/passive-interface';
import { SuperAttack } from '~/src/shared/model/super-attack-interface';

export default function generateCard(form: FormGroup<CardForm>) {
  let characterInfo = signal<Character | null>(null);
  let passiveDetails = signal<Passive | null>(null);
  let superAttackInfo = signal<SuperAttack | null>(null);
  const data = form.getRawValue();
  characterInfo.set({
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
      (value) => categories[value - 1].categoryName
    ),
    links: data.links.links.map((value) => Links[value - 1].linkName),
    activeSkill: data.activeSkill.hasActiveSkill
      ? {
          activeSkillName: data.activeSkill.activeSkillName ?? '',
          activeSkillCondition: data.activeSkill.activeSkillCondition ?? '',
          activeSkillEffect: data.activeSkill.activeSkillEffect ?? '',
        }
      : null,
  });
  let passiveInfo: Passive = {
    name: data.passive.passiveName ?? '',
    passive: data.passive.passivePart.map((value) => {
      return {
        passiveConditionActivation: value.customPassiveConditionActivation
          ? value.customPassiveConditionActivation
          : passiveConditionActivation[value.passiveConditionActivation - 1]
              .effect,
        effect: value.effect.map((e) => {
          return {
            description: e.effectDescription,
            imageSrc:
              e.effectDuration > 1 ? getDurationLogo(e.effectDuration) : '',
          };
        }),
      };
    }),
  };
  superAttackInfo.set({
    superAttackName: data.superAttack.superAttackName,
    superAttackEffect: data.superAttack.superAttackEffect,
    ultraSuperAttackName: data.superAttack.ultraSuperAttackName,
    ultraSuperAttackEffect: data.superAttack.ultraSuperAttackEffect,
  });
  passiveDetails.set(passiveInfo);
  return {
    characterInfo: characterInfo,
    passiveDetails: passiveDetails,
    superAttackInfo: superAttackInfo,
  };
}
