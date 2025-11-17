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

import { Observable, of, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ErrorComponent } from '../error/error.component';
import { SuperAttackFormGroup } from '../../model/super-attack-form-group-interface';

@Component({
  selector: 'app-super-attack-form',
  imports: [ErrorComponent, ReactiveFormsModule],
  templateUrl: './super-attack-form.component.html',
  styleUrl: './super-attack-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class SuperAttackFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  readonly #destroyRef = inject(DestroyRef);
  controlKey = input.required<string>();
  label = input.required<string>();
  isLegendaryCharacter = input.required<boolean>();
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<SuperAttackFormGroup>({
        superAttackName: new FormControl('', {
          nonNullable: true,
        }),
        superAttackEffect: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        ultraSuperAttackName: new FormControl('', {
          nonNullable: true,
        }),
        ultraSuperAttackEffect: new FormControl('', {
          nonNullable: true,
        }),
      })
    );
  }
}
