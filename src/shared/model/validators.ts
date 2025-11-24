import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const ultraSuperAttackRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const isLegendaryCharacter = control.get(
    'isLegendaryCharacter'
  ) as AbstractControl<boolean>;
  const ultraSuperAttack = control.get('ultraSuperAttack');
  return isLegendaryCharacter.value && ultraSuperAttack?.value === ''
    ? { ultraSuperAttackRequired: true }
    : null;
};

export const activeSkillNameRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const hasActiveSkill = control.get(
    'hasActiveSkill'
  ) as AbstractControl<boolean>;
  const activeSkillName = control.get('activeSkillName') as FormControl;
  if (hasActiveSkill.value && activeSkillName.value === '') {
    return { activeSkillNameRequired: true };
  }
  return null;
};

export const activeSkillConditionRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const hasActiveSkill = control.get(
    'hasActiveSkill'
  ) as AbstractControl<boolean>;
  const activeSkillCondition = control.get(
    'activeSkillCondition'
  ) as FormControl;
  if (hasActiveSkill.value && activeSkillCondition.value === '') {
    return { activeSkillConditionRequired: true };
  }
  return null;
};

export const activeSkillEffectRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const hasActiveSkill = control.get(
    'hasActiveSkill'
  ) as AbstractControl<boolean>;
  const activeSkillEffect = control.get('activeSkillEffect') as FormControl;
  if (hasActiveSkill.value && activeSkillEffect.value === '') {
    return { activeSkillEffectRequired: true };
  }
  return null;
};

export const artworkFormat: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }
  const validImageRegex = /\.(jpeg|jpg|png|gif|webp)$/i;
  return validImageRegex.test(control.value)
    ? null
    : { invalidArtworkFormat: true };
};
