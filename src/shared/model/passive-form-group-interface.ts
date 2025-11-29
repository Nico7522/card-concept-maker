import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface PassiveFormGroup {
  passiveName: FormControl<string>;
  passivePart: FormArray<FormGroup<PassivePartFormGroup>>;
}

export interface PassivePartFormGroup {
  passiveConditionActivation: FormControl<number>;
  customPassiveConditionActivation: FormControl<string>;
  effect: FormArray<FormGroup<EffectFormGroup>>;
}

export interface EffectFormGroup {
  effectDescription: FormControl<string>;
  effectDuration: FormControl<number>;
}
