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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

import { ErrorComponent } from '~/src/shared/ui';
import {
  activeSkillConditionRequired,
  activeSkillEffectRequired,
  ActiveSkillFormGroup,
  activeSkillNameRequired,
} from '../..';

@Component({
  selector: 'app-active-skill-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    ErrorComponent,
  ],
  templateUrl: './active-skill-form.component.html',
  styleUrl: './active-skill-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ActiveSkillFormComponent implements OnDestroy, OnInit {
  readonly #parentContainer = inject(ControlContainer);
  controlKey = input.required<string>();
  label = input.required<string>();

  get activeSkill() {
    return this.parentFormGroup.get('activeSkill')?.get('hasActiveSkill')
      ?.value;
  }

  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  get activeSkillForm(): FormGroup<ActiveSkillFormGroup> {
    return this.parentFormGroup.get(
      this.controlKey(),
    ) as FormGroup<ActiveSkillFormGroup>;
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<ActiveSkillFormGroup>(
        {
          hasActiveSkill: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          activeSkillName: new FormControl('', {
            nonNullable: true,
          }),
          activeSkillCondition: new FormControl('', {
            nonNullable: true,
          }),
          activeSkillEffect: new FormControl('', {
            nonNullable: true,
          }),
        },
        {
          validators: [
            activeSkillNameRequired,
            activeSkillConditionRequired,
            activeSkillEffectRequired,
          ],
        },
      ),
    );
  }
}
