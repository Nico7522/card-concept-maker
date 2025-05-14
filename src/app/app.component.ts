import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UbButtonDirective } from '~/components/ui/button';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArchiveBoxXMark,
  heroArrowLeft,
  heroArrowLongRight,
} from '@ng-icons/heroicons/outline';
import { ErrorComponent } from './shared/error/error.component';
import { passiveConditionActivation } from './select-options/passive-condition-activation';
import { effectDuration } from './select-options/effect-duration';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    UbButtonDirective,
    NgIconComponent,
    ErrorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  viewProviders: [
    provideIcons({ heroArchiveBoxXMark, heroArrowLeft, heroArrowLongRight }),
  ],
})
export class AppComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  passiveConditionActivation = passiveConditionActivation;
  characterInfo = signal<{
    attack: number;
    defense: number;
    hp: number;
  } | null>(null);
  passiveDetails = signal<
    | {
        passiveConditionActivation: string;
        effect: { description: string; imageSrc: string }[];
      }[]
    | null
  >(null);

  isFirstPartShow = signal(true);
  title = signal('Card Details');
  effectDuration = effectDuration;
  form = this.formBuilder.group({
    attack: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    defense: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    hp: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    passivePart: this.formBuilder.array([
      this.formBuilder.group({
        passiveConditionActivation: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        effect: this.formBuilder.array([
          this.formBuilder.group({
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
  });

  // Get a full passive part
  getPassiveParts(): FormArray {
    return this.form.get('passivePart') as FormArray;
  }

  // Get all effects for a passive part
  getPassiveEffects(index: number): FormArray {
    return this.getPassiveParts().controls[index].get('effect') as FormArray;
  }

  // Add a passive Part to the form
  AddPassivePart() {
    this.getPassiveParts().push(
      this.formBuilder.group({
        passiveConditionActivation: new FormControl(
          this.passiveConditionActivation[0].value,
          [Validators.required]
        ),
        effect: this.formBuilder.array([
          this.formBuilder.group({
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

  // Add a effect to a specific passive part
  addPassiveEffect(index: number) {
    this.getPassiveEffects(index).push(
      this.formBuilder.group({
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

  // Remove a effect from a specific passive part
  removePassiveEffect(index: number, index2: number) {
    this.getPassiveEffects(index).removeAt(index2);
  }

  // Remave a passive part
  removePassivePart(index: number) {
    this.getPassiveParts().removeAt(index);
  }

  onSubmit() {
    const data = this.form.getRawValue();
    this.characterInfo.set({
      attack: +data.attack,
      defense: +data.defense,
      hp: +data.hp,
    });

    let array: {
      passiveConditionActivation: string;
      effect: { description: string; imageSrc: string }[];
    }[] = [];
    data.passivePart.map((v) => {
      array.push({
        passiveConditionActivation:
          this.passiveConditionActivation[v.passiveConditionActivation - 1]
            .effect,
        effect: v.effect.map((e) => {
          return {
            description: e.effectDescription,
            imageSrc:
              e.effectDuration > 1
                ? this.getDurationLogo(e.effectDuration)
                : '',
          };
        }),
      });
    });

    this.passiveDetails.set(array);
  }

  private getDurationLogo(value: number): string {
    let src: string = '';
    switch (+value) {
      case 2:
        src = 'one.webp';
        break;
      case 3:
        src = 'infinite.webp';
        break;
      case 4:
        src = 'up.webp';
        break;
      default:
        break;
    }
    return src;
  }

  showFirstPart(value: boolean) {
    this.isFirstPartShow.set(value);
    this.title.set(value ? 'Card Details' : 'Passive Card Details');
  }
}
