import {
  ChangeDetectionStrategy,
  Component,
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
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { NgIcon } from '@ng-icons/core';
import { EffectFormGroup, PassiveFormGroup, PassivePartFormGroup } from '../..';
import { ErrorComponent } from '~/src/shared/ui';
import { GameDataService } from '~/src/shared/api';

@Component({
  selector: 'app-passive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    ErrorComponent,
    NgIcon,
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
  readonly #gameDataService = inject(GameDataService);
  controlKey = input.required<string>();
  label = input.required<string>();
  passiveConditionActivation = this.#gameDataService.passiveConditionActivation;
  effectDuration = this.#gameDataService.effectDuration;
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
      }),
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
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
      }),
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
      }),
    );
  }
}
