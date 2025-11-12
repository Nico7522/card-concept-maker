import {
  Component,
  DestroyRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SuperAttackFormComponent } from '../super-attack-form/super-attack-form.component';
import { CategoriesFormComponent } from '../categories-form/categories-form.component';
import { LinksFormComponent } from '../links-form/links-form.component';
import { PassiveFormComponent } from '../passive-form/passive-form.component';
import { ActiveSkillFormComponent } from '../active-skill-form/active-skill-form.component';
import { ErrorComponent } from '../../shared/error/error.component';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { BaseStatFormComponent } from '../base-stat-form/base-stat-form.component';
import { CardForm } from '../../shared/models/form-interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class CardFormComponent {
  readonly #parentContainer = inject(ControlContainer);
  readonly #destroyRef = inject(DestroyRef);

  controlKey = input.required<string>();
  label = input.required<string>();
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }
  isLegendary = signal(false);

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    const confirmationMessage = 'Are you sure ?';
    (event as BeforeUnloadEvent).returnValue = confirmationMessage;
  }
  ngOnDestroy(): void {
    this.#destroyRef.onDestroy(() => {
      this.parentFormGroup.removeControl(this.controlKey());
    });
    window.removeEventListener('beforeunload', this.onBeforeUnload);
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
}
