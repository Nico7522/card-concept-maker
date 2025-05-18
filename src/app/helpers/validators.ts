import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const ultraSuperAttackRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const isLegendaryCharacter = control.get('isLegendaryCharacter');
  const ultraSuperAttack = control.get('ultraSuperAttack');
  return isLegendaryCharacter &&
    ultraSuperAttack?.dirty &&
    ultraSuperAttack?.value === ''
    ? { ultraSuperAttackRequired: true }
    : null;
};
