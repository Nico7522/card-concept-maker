import { FormGroup } from '@angular/forms';

import { CardForm, generateCard } from '~/src/features/card-form';
import { Card } from '~/src/entities/card';
import { Category, Link, PassiveConditionActivation } from '~/src/shared/model';

export function buildGuestPreviewCard(
  form: FormGroup<CardForm>,
  categories: Category[],
  links: Link[],
  passiveConditionActivation: PassiveConditionActivation[],
): Card {
  const data = form.getRawValue();
  const { characterInfo, passiveDetails, superAttackInfo } = generateCard(
    form,
    categories,
    links,
    passiveConditionActivation,
  );

  return {
    creatorName: '',
    creatorId: '',
    cardName: data.cardName ?? '',
    characterInfo: characterInfo()!,
    passiveDetails: passiveDetails()!,
    superAttackInfo: superAttackInfo()!,
  };
}
