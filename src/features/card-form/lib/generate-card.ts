import { signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CardForm } from '~/src/features/card-form/model/card-form-interface';
import { Character } from '~/src/entities/card/model/character-type';
import { Passive } from '~/src/entities/card/model/passive-type';
import { SuperAttack } from '~/src/entities/card/model/super-attack-type';
import { PassiveConditionActivation, Category, Link } from '~/src/shared/model';
export default function generateCard(
  form: FormGroup<CardForm>,
  categories: Category[],
  links: Link[],
  passiveConditionActivation: PassiveConditionActivation[]
) {
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
    links: data.links.links.map((value) => links[value - 1].linkName),
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

function getDurationLogo(value: number): string {
  let src: string = '';
  switch (+value) {
    case 2:
      src = 'one.webp';
      break;
    case 3:
      src = 'infinite.webp';
      break;
    case 4:
      src = 'up.webp';
      break;
    default:
      break;
  }
  return src;
}