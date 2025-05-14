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
import { heroArchiveBoxXMark } from '@ng-icons/heroicons/outline';
import { ErrorComponent } from './shared/error/error.component';

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
  viewProviders: [provideIcons({ heroArchiveBoxXMark })],
})
export class AppComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  passiveConditionActivation = [
    {
      value: 1,
      effect: 'Basic Effect(s)',
    },
    {
      value: 2,
      effect: 'For every ki spehere obtained',
    },
    {
      value: 3,
      effect: 'After evading an attack',
    },
    {
      value: 4,
      effect: 'After receiving an attack',
    },
    {
      value: 5,
      effect: 'When receiving an attack for the 1st time within the turn',
    },
    {
      value: 6,
      effect: 'Before receiving an attack within the turn',
    },
    {
      value: 7,
      effect: '23 Ki Spheres obtained',
    },
    {
      value: 8,
      effect: 'Starting from the 4th turn from the start of battle',
    },
    {
      value: 9,
      effect: 'Starting from the 5th turn from the start of battle',
    },
    {
      value: 10,
      effect: 'Starting from the 6th turn from the start of battle',
    },
  ];

  effectDuration = [
    {
      value: 1,
      duration: 'None',
    },
    {
      value: 2,
      duration: '! 1',
    },
    {
      value: 3,
      duration: '∞',
    },
    {
      value: 4,
      duration: '↑',
    },
  ];
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
  ngOnInit() {
    console.log(this.getPassiveParts().controls[0].get('effect'));
  }

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

  removePassiveEffect(index: number, index2: number) {
    this.getPassiveEffects(index).removeAt(index2);
  }

  removePassivePart(index: number) {
    this.getPassiveParts().removeAt(index);
  }
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
  onSubmit() {
    console.log(this.getPassiveEffects(0).controls[0].get('effectDescription'));

    const data = this.form.getRawValue();
    this.characterInfo.set({
      attack: +data.attack,
      defense: +data.defense,
      hp: +data.hp,
    });
    console.log(data);

    let array: {
      passiveConditionActivation: string;
      effect: { description: string; imageSrc: string }[];
    }[] = [];
    data.passivePart.map((v) => {
      console.log(v.passiveConditionActivation);

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
}
