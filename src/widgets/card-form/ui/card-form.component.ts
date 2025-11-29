import {
  Component,
  DestroyRef,
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
import { ErrorComponent } from '~/src/shared/ui';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LinksFormComponent,
  PassiveFormComponent,
  ActiveSkillFormComponent,
  BaseStatFormComponent,
  ArtworkFormComponent,
  SuperAttackFormComponent,
  CategoriesFormComponent,
} from '~/src/shared/ui';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '~/src/shared/api';
import { CardForm } from '..';

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
    AsyncPipe,
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
  readonly #authService = inject(AuthService);
  user$ = this.#authService.user$;
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
