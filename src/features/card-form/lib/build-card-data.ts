import { FormGroup } from '@angular/forms';
import { Card } from '~/src/entities/card';
import { CardForm } from '../model/card-form-interface';
import { generateCard } from './generate-card';
import { Category, Link, PassiveConditionActivation } from '~/src/shared/model';

interface GameData {
  categories: Category[];
  links: Link[];
  passiveConditionActivation: PassiveConditionActivation[];
}

interface UserInfo {
  displayName: string | null;
  uid: string;
}

interface CardLinkIds {
  transformedCardId?: string;
  baseCardId?: string;
}

export function buildCardData(
  form: FormGroup<CardForm>,
  gameData: GameData,
  user: UserInfo,
  linkIds?: CardLinkIds,
): Card {
  const data = form.getRawValue();
  const { characterInfo, passiveDetails, superAttackInfo } = generateCard(
    form,
    gameData.categories,
    gameData.links,
    gameData.passiveConditionActivation,
  );

  const charInfo = characterInfo();
  if (charInfo && linkIds) {
    if (linkIds.transformedCardId !== undefined || linkIds.baseCardId !== undefined) {
      charInfo.activeSkill = {
        ...charInfo.activeSkill,
        activeSkillName: charInfo.activeSkill?.activeSkillName ?? '',
        activeSkillCondition: charInfo.activeSkill?.activeSkillCondition ?? '',
        activeSkillEffect: charInfo.activeSkill?.activeSkillEffect ?? '',
        ...(linkIds.transformedCardId !== undefined && {
          transformedCardId: linkIds.transformedCardId,
        }),
        ...(linkIds.baseCardId !== undefined && { baseCardId: linkIds.baseCardId }),
      };
    }
  }

  return {
    creatorName: user.displayName ?? '',
    creatorId: user.uid,
    cardName: data.cardName,
    characterInfo: charInfo,
    passiveDetails: passiveDetails(),
    superAttackInfo: superAttackInfo(),
  };
}
