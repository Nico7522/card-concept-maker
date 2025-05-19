import {
  AbstractControl,
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
  const activeSkill = control.get('activeSkill') as FormGroup;
  if (
    hasActiveSkill.value &&
    activeSkill.get('activeSkillName')?.value === ''
  ) {
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
  const activeSkill = control.get('activeSkill') as FormGroup;
  if (
    hasActiveSkill.value &&
    activeSkill.get('activeSkillCondition')?.value === ''
  ) {
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
  const activeSkill = control.get('activeSkill') as FormGroup;
  if (
    hasActiveSkill.value &&
    activeSkill.get('activeSkillEffect')?.value === ''
  ) {
    return { activeSkillEffectRequired: true };
  }
  return null;
};
