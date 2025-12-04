import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { Card } from '~/src/shared/model/card-interface';
import { CardForm } from '~/src/widgets/card-form/model/card-form-interface';
import {
  EffectFormGroup,
  PassivePartFormGroup,
} from '~/src/shared/model/passive-form-group-interface';
import {
  Category,
  EffectDuration,
  Link,
  PassiveConditionActivation,
} from '~/src/shared/model';

export default function patchCardForm(
  form: FormGroup<CardForm>,
  card: Card,
  categories: Category[],
  links: Link[],
  passiveConditionActivation: PassiveConditionActivation[],
  effectDuration: EffectDuration[]
) {
  if (card.characterInfo) {
    form.patchValue(card);
    form.get('artwork')?.patchValue(card.artwork ?? null);
    form.get('type')?.patchValue(card.characterInfo.type);
    form.get('class')?.patchValue(card.characterInfo.class);
    form
      .get('isLegendary')
      ?.patchValue(card.characterInfo.isLegendaryCharacter);

    form.get('stats')?.patchValue(card.characterInfo.stats);
    form.get('leaderSkill')?.patchValue(card.characterInfo.leaderSkill);

    form.get('superAttack')?.patchValue({
      superAttackName: card.superAttackInfo?.superAttackName ?? '',
      superAttackEffect: card.superAttackInfo?.superAttackEffect ?? '',
      ultraSuperAttackName: card.superAttackInfo?.ultraSuperAttackName ?? '',
      ultraSuperAttackEffect:
        card.superAttackInfo?.ultraSuperAttackEffect ?? '',
    });

    const selectedCategories = categories.filter((category) => {
      return card.characterInfo?.categories.includes(category.categoryName);
    });

    let cateForm = form.get('categories')?.get('categories') as FormArray<
      FormControl<number>
    >;
    selectedCategories.forEach((category) => {
      return cateForm.push(
        new FormControl(category.value, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );
    });

    const selectedLinks = links.filter((link) => {
      return card.characterInfo?.links.includes(link.linkName);
    });

    let linkForm = form.get('links')?.get('links') as FormArray<
      FormControl<number>
    >;
    selectedLinks.forEach((link) => {
      return linkForm.push(
        new FormControl(link.value, {
          nonNullable: true,
          validators: [Validators.required],
        })
      );
    });

    form
      .get('passive.passiveName')
      ?.patchValue(card.passiveDetails?.name ?? '');

    const passiveParts = form.get('passive.passivePart') as FormArray<
      FormGroup<PassivePartFormGroup>
    >;
    const passiveData = card.passiveDetails?.passive ?? [];

    if (!passiveData.length) {
      return;
    }

    passiveParts.clear();

    const createEffectGroup = (
      description = '',
      duration = effectDuration[0].value
    ) =>
      new FormGroup<EffectFormGroup>({
        effectDescription: new FormControl(description, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        effectDuration: new FormControl(duration, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      });

    const resolveDuration = (icon?: string | null) => {
      if (!icon) {
        return effectDuration[0].value;
      }

      const match = effectDuration.find(
        (durationOption) => durationOption.icon === icon
      );

      return match?.value ?? effectDuration[0].value;
    };

    const resolveCondition = (condition: string) => {
      const match = passiveConditionActivation.find(
        (activation) => activation.effect === condition
      );

      return {
        value: match?.value ?? ('custom' as const),
        customValue: match ? '' : condition,
      };
    };

    passiveData.forEach((passive) => {
      const { value, customValue } = resolveCondition(
        passive.passiveConditionActivation
      );

      const effects =
        passive.effect?.length && passive.effect.length > 0
          ? passive.effect.map((effect) =>
              createEffectGroup(
                effect.description,
                resolveDuration(effect.imageSrc)
              )
            )
          : [createEffectGroup()];

      passiveParts.push(
        new FormGroup<PassivePartFormGroup>({
          passiveConditionActivation: new FormControl(value as number, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          customPassiveConditionActivation: new FormControl(customValue, {
            nonNullable: true,
          }),
          effect: new FormArray<FormGroup<EffectFormGroup>>(effects),
        })
      );
    });
  }

  form.get('activeSkill')?.patchValue({
    hasActiveSkill: card.characterInfo?.activeSkill ? true : false,
    activeSkillName: card.characterInfo?.activeSkill?.activeSkillName ?? '',
    activeSkillCondition:
      card.characterInfo?.activeSkill?.activeSkillCondition ?? '',
    activeSkillEffect: card.characterInfo?.activeSkill?.activeSkillEffect ?? '',
  });
}
