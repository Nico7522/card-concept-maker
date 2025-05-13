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

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    UbButtonDirective,
    NgIconComponent,
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
      effect: 'After evading a attack',
    },
    {
      value: 4,
      effect: 'After receiving a attack',
    },
  ];

  effectDuration = [
    {
      value: 1,
      duration: '! 1',
    },
    {
      value: 2,
      duration: '∞',
    },
  ];
  form = this.formBuilder.group({
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
  passiveDetails = signal<
    | {
        passiveConditionActivation: string;
        effect: { description: string; imageSrc: string }[];
      }[]
    | null
  >(null);
  onSubmit() {
    const data = this.form.getRawValue();
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
            imageSrc: this.getDurationLogo(e.effectDuration),
          };
        }),
      });
    });

    this.passiveDetails.set(array);
    console.log(this.passiveDetails());
  }

  private getDurationLogo(value: number): string {
    let src: string = '';
    switch (value) {
      case 1:
        src = 'one.webp';
        break;
      case 2:
        src = '∞';
        break;
      default:
        break;
    }
    return src;
  }
}
