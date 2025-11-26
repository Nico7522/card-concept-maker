import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ErrorComponent } from '../../../shared/ui/error/error.component';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SuperAttackFormComponent } from '~/src/shared/ui/super-attack-form/super-attack-form.component';
import { CategoriesFormComponent } from '~/src/shared/ui/categories-form/categories-form.component';
import { LinksFormComponent } from '~/src/shared/ui/links-form/links-form.component';
import { PassiveFormComponent } from '~/src/shared/ui/passive-form/passive-form.component';
import { ActiveSkillFormComponent } from '~/src/shared/ui/active-skill-form/active-skill-form.component';
import { BaseStatFormComponent } from '~/src/shared/ui/base-stat-form/base-stat-form.component';
import { CardForm } from '../../model/card-form-interface';
import { ArtworkFormComponent } from '~/src/shared/ui/artwork-form/artwork-form.component';
import { map } from 'rxjs';
import { ultraSuperAttackRequired } from '~/src/shared/model/validators';

@Component({
  selector: 'app-card-form',
  imports: [
    SuperAttackFormComponent,
    CategoriesFormComponent,
    LinksFormComponent,
    PassiveFormComponent,
    ActiveSkillFormComponent,
    ErrorComponent,
    NgSelectComponent,
    NgOptionComponent,
    BaseStatFormComponent,
    ReactiveFormsModule,
    ArtworkFormComponent,
  ],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class CardFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  readonly #destroyRef = inject(DestroyRef);
  artwork = output<FormData>();
  controlKey = input.required<string>();
  label = input.required<string>();

  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }
  isLegendary = signal(false);

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<CardForm>({
        cardName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        type: new FormControl('teq', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        class: new FormControl('super', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        leaderSkill: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        isLegendary: new FormControl(false, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      } as CardForm)
    );
    this.parentFormGroup
      .get('cardForm')
      ?.get('isLegendary')
      ?.valueChanges?.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        this.isLegendary.set(value as boolean);
      });
  }
  handleArtwork(formData: FormData) {
    this.artwork.emit(formData);
  }
}
