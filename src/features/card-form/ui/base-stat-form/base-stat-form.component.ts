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
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorComponent } from '~/src/shared/ui';
import { BaseStatFormGroup } from '../..';

@Component({
  selector: 'app-base-stat-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ErrorComponent],
  templateUrl: './base-stat-form.component.html',
  styleUrl: './base-stat-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class BaseStatFormComponent implements OnDestroy, OnInit {
  readonly #parentContainer = inject(ControlContainer);
  controlKey = input.required<string>();
  label = input.required<string>();
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  get baseStatForm(): FormGroup<BaseStatFormGroup> {
    return this.parentFormGroup.get(
      this.controlKey(),
    ) as FormGroup<BaseStatFormGroup>;
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<BaseStatFormGroup>({
        attack: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required, Validators.max(99999)],
        }),
        defense: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required, Validators.max(99999)],
        }),
        hp: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required, Validators.max(99999)],
        }),
      }),
    );
  }
}
