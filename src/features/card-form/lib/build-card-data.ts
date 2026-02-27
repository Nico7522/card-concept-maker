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

export function buildCardData(
  form: FormGroup<CardForm>,
  gameData: GameData,
  user: UserInfo,
  transformedCardId?: string,
): Card {
  const data = form.getRawValue();
  const { characterInfo, passiveDetails, superAttackInfo } = generateCard(
    form,
    gameData.categories,
    gameData.links,
    gameData.passiveConditionActivation,
  );

  const charInfo = characterInfo();
  if (charInfo?.activeSkill && transformedCardId !== undefined) {
    charInfo.activeSkill.transformedCardId = transformedCardId;
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
