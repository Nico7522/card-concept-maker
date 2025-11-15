import {
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passiveConditionActivation } from '~/src/app/select-options/passive-condition-activation';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { ErrorComponent } from '../error/error.component';
import { effectDuration } from '~/src/app/select-options/effect-duration';
import { NgIcon } from '@ng-icons/core';
import { UbButtonDirective } from '~/components/ui/button';
import {
  EffectFormGroup,
  PassiveFormGroup,
  PassivePartFormGroup,
} from '../../model/passive-form-group-interface';

@Component({
  selector: 'app-passive-form',
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    ErrorComponent,
    NgIcon,
    UbButtonDirective,
  ],
  templateUrl: './passive-form.component.html',
  styleUrl: './passive-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class PassiveFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  readonly #destroyRef = inject(DestroyRef);
  controlKey = input.required<string>();
  label = input.required<string>();
  passiveConditionActivation = passiveConditionActivation;
  effectDuration = effectDuration;
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }
  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<PassiveFormGroup>({
        passiveName: new FormControl('', {
          nonNullable: true,
        }),
        passivePart: new FormArray([
          new FormGroup<PassivePartFormGroup>({
            passiveConditionActivation: new FormControl(1, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            customPassiveConditionActivation: new FormControl('', {
              nonNullable: true,
            }),
            effect: new FormArray([
              new FormGroup<EffectFormGroup>({
                effectDescription: new FormControl('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                effectDuration: new FormControl(1, {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
              }),
            ]),
          }),
        ]),
      })
    );
  }

  ngOnDestroy(): void {
    this.#destroyRef.onDestroy(() => {
      this.parentFormGroup.removeControl(this.controlKey());
    });
  }

  // Get a full passive part
  get passiveParts(): FormArray {
    const formGroup = this.parentFormGroup.get(this.controlKey()) as FormArray;
    return formGroup.get('passivePart') as FormArray;
  }

  // Get all effects for a passive part
  getPassiveEffects(index: number): FormArray {
    return this.passiveParts.controls[index].get('effect') as FormArray;
  }

  onOptionChange(event: any, index: number) {
    const control = this.passiveParts.controls[index];
    if (event === 'custom') {
      control.get('customPassiveConditionActivation')?.enable();
    } else {
      control.get('customPassiveConditionActivation')?.disable();
    }
  }

  isCustomConditionSelected(index: number): boolean {
    const control = this.passiveParts.at(index);
    return control.get('passiveConditionActivation')?.value === 'custom';
  }

  removePassiveEffect(index: number, index2: number) {
    this.getPassiveEffects(index).removeAt(index2);
  }

  addPassiveEffect(index: number) {
    this.getPassiveEffects(index).push(
      new FormGroup({
        effectDescription: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        effectDuration: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      })
    );
  }

  removePassivePart(index: number) {
    this.passiveParts.removeAt(index);
  }

  addPassivePart() {
    this.passiveParts.push(
      new FormGroup({
        passiveConditionActivation: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        customPassiveConditionActivation: new FormControl(''),
        effect: new FormArray([
          new FormGroup({
            effectDescription: new FormControl('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            effectDuration: new FormControl(1, {
              nonNullable: true,
              validators: [Validators.required],
            }),
          }),
        ]),
      })
    );
  }
}
