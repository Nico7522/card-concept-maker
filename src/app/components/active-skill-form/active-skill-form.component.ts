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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { ErrorComponent } from '../../shared/error/error.component';

import { ActiveSkillFormGroup } from '../../shared/models/form-interface';
import {
  activeSkillConditionRequired,
  activeSkillEffectRequired,
  activeSkillNameRequired,
} from '../../helpers/validators';

@Component({
  selector: 'app-active-skill-form',
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
  readonly #destroyRef = inject(DestroyRef);
  controlKey = input.required<string>();
  label = input.required<string>();

  get activeSkill() {
    return this.parentFormGroup.get('activeSkill')?.get('hasActiveSkill')
      ?.value;
  }

  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnDestroy(): void {
    this.#destroyRef.onDestroy(() => {
      this.parentFormGroup.removeControl(this.controlKey());
    });
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
        }
      )
    );
  }
}
