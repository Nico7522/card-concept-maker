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
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorComponent } from '../error/error.component';
import { BaseStatFormGroup } from '../../model/base-stat-form-group-interface';

@Component({
  selector: 'app-base-stat-form',
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
  readonly #destroyRef = inject(DestroyRef);
  controlKey = input.required<string>();
  label = input.required<string>();
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
      new FormGroup<BaseStatFormGroup>({
        attack: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        defense: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        hp: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      })
    );
  }
}
