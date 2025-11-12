import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type CardForm = {
  cardName: FormControl<string>;
  type: FormControl<string>;
  class: FormControl<string>;
  stats: FormGroup<BaseStatFormGroup>;
  isLegendary: FormControl<boolean>;
  leaderSkill: FormControl<string>;
  superAttack: FormGroup<SuperAttackFormGroup>;
  categories: FormGroup<CategoriesFormGroup>;
  links: FormGroup<LinksFormGroup>;
  passive: FormGroup<PassiveFormGroup>;
  activeSkill: FormGroup<ActiveSkillFormGroup>;
};
export type BaseStatFormGroup = {
  attack: FormControl<number | null>;
  defense: FormControl<number | null>;
  hp: FormControl<number | null>;
};
export type SuperAttackFormGroup = {
  superAttackName: FormControl<string>;
  superAttackEffect: FormControl<string>;
  ultraSuperAttackName: FormControl<string>;
  ultraSuperAttackEffect: FormControl<string>;
};

export type CategoriesFormGroup = {
  categories: FormArray<FormControl<number>>;
};

export type LinksFormGroup = {
  links: FormArray<FormControl<number>>;
};

export type PassiveFormGroup = {
  passiveName: FormControl<string>;
  passivePart: FormArray<FormGroup<PassivePartFormGroup>>;
};

export type PassivePartFormGroup = {
  passiveConditionActivation: FormControl<number>;
  customPassiveConditionActivation: FormControl<string>;
  effect: FormArray<FormGroup<EffectFormGroup>>;
};

export type EffectFormGroup = {
  effectDescription: FormControl<string>;
  effectDuration: FormControl<number>;
};
export type ActiveSkillFormGroup = {
  hasActiveSkill: FormControl<boolean>;
  activeSkillName: FormControl<string>;
  activeSkillCondition: FormControl<string>;
  activeSkillEffect: FormControl<string>;
};
