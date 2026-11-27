import {
  AbstractControl,
  FormArray,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const ultraSuperAttackRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const isLegendary = control.parent?.get('isLegendary');
  const ultraSuperAttackEffect = control.get('ultraSuperAttackEffect');

  if (isLegendary?.value && !ultraSuperAttackEffect?.value) {
    return { ultraSuperAttackRequired: true };
  }
  return null;
};

export const activeSkillNameRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const hasActiveSkill = control.get(
    'hasActiveSkill',
  ) as AbstractControl<boolean>;
  const activeSkillName = control.get('activeSkillName') as FormControl;
  if (hasActiveSkill.value && activeSkillName.value === '') {
    return { activeSkillNameRequired: true };
  }
  return null;
};

export const activeSkillConditionRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const hasActiveSkill = control.get(
    'hasActiveSkill',
  ) as AbstractControl<boolean>;
  const activeSkillCondition = control.get(
    'activeSkillCondition',
  ) as FormControl;
  if (hasActiveSkill.value && activeSkillCondition.value === '') {
    return { activeSkillConditionRequired: true };
  }
  return null;
};

export const activeSkillEffectRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const hasActiveSkill = control.get(
    'hasActiveSkill',
  ) as AbstractControl<boolean>;
  const activeSkillEffect = control.get('activeSkillEffect') as FormControl;
  if (hasActiveSkill.value && activeSkillEffect.value === '') {
    return { activeSkillEffectRequired: true };
  }
  return null;
};

export const artworkFormat: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }
  const validImageRegex = /\.(jpeg|jpg|png|gif|webp)$/i;
  return validImageRegex.test(control.value)
    ? null
    : { invalidArtworkFormat: true };
};

// Same limit as the API (/upload rejects larger files)
export const MAX_ARTWORK_SIZE_MB = 10;
export const MAX_ARTWORK_SIZE_BYTES = MAX_ARTWORK_SIZE_MB * 1024 * 1024;

/**
 * The control only holds the file name, so the size is checked when the file
 * is picked and read here through `isTooLarge`.
 */
export const artworkMaxSize =
  (isTooLarge: () => boolean): ValidatorFn =>
  (): ValidationErrors | null =>
    isTooLarge() ? { artworkTooLarge: true } : null;

export const domainNameRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const hasDomain = control.get('hasDomain') as AbstractControl<boolean>;
  const domainName = control.get('domainName') as FormControl;
  if (hasDomain.value && domainName.value === '') {
    return { domainNameRequired: true };
  }
  return null;
};

export const domainEffectRequired: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const hasDomain = control.get('hasDomain') as AbstractControl<boolean>;
  const domainEffect = control.get('domainEffect') as FormControl;
  if (hasDomain.value && domainEffect.value === '') {
    return { domainEffectRequired: true };
  }
  return null;
};

export const categoryAlreadySelected: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const categoriesFormArray = control.get('categories') as FormArray<
    FormControl<number>
  >;
  const categories = categoriesFormArray.value;

  const seen = new Set<number>();
  for (const category of categories) {
    if (category !== null && category !== undefined) {
      if (seen.has(category)) {
        return { categoryAlreadySelected: true };
      }
      seen.add(category);
    }
  }

  return null;
};

export const linkAlreadySelected: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const linksFormArray = control.get('links') as FormArray<FormControl<number>>;
  const links = linksFormArray.value;

  const seen = new Set<number>();
  for (const link of links) {
    if (link !== null && link !== undefined) {
      if (seen.has(link)) {
        return { linkAlreadySelected: true };
      }
      seen.add(link);
    }
  }

  return null;
};
