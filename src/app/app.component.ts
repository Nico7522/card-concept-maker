import {
  Component,
  ComponentRef,
  inject,
  inputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormArray,
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
  heroPlus,
} from '@ng-icons/heroicons/outline';
import { ErrorComponent } from './shared/error/error.component';
import { passiveConditionActivation } from './select-options/passive-condition-activation';
import { effectDuration } from './select-options/effect-duration';
import { CardComponent } from './shared/card/card.component';
import { Links } from './select-options/links';
import { categories } from './select-options/categories';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    UbButtonDirective,
    NgIconComponent,
    ErrorComponent,
    NgSelectComponent,
    NgOptionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  viewProviders: [
    provideIcons({
      heroArchiveBoxXMark,
      heroArrowLeft,
      heroArrowLongRight,
      heroPlus,
    }),
  ],
})
export class AppComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  passiveConditionActivation = passiveConditionActivation;
  effectDuration = effectDuration;
  categories = categories;
  links = Links;
  characterInfo = signal<{
    stats: {
      attack: number;
      defense: number;
      hp: number;
    };
    leaderSkill: string;
    superAttack: string;
    isLegendaryCharacter: boolean;
    categories: string[];
    links: string[];
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

    leaderSkill: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    superAttack: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isLegendaryCharacter: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    categories: this.formBuilder.array([
      this.formBuilder.group({
        category: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    ]),
    links: this.formBuilder.array([
      this.formBuilder.group({
        link: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    ]),
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

  // Get links
  getLinks(): FormArray {
    return this.form.get('links') as FormArray;
  }

  // Get categories
  getCategories() {
    return this.form.get('categories') as FormArray;
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

  // Add a link
  addLink() {
    this.getLinks().push(
      this.formBuilder.group({
        link: new FormControl(1, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      })
    );
  }

  // Add a category
  addCategory() {
    this.getCategories().push(
      this.formBuilder.group({
        category: new FormControl(1, {
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

  removeLink(index: number) {
    this.getLinks().removeAt(index);
  }

  removeCategory(index: number) {
    this.getCategories().removeAt(index);
  }

  onSubmit() {
    const data = this.form.getRawValue();
    data.links.map((l) => console.log(l.link));

    this.characterInfo.set({
      stats: {
        attack: +data.attack,
        defense: +data.defense,
        hp: +data.hp,
      },
      leaderSkill: data.leaderSkill,
      superAttack: data.superAttack,
      isLegendaryCharacter: data.isLegendaryCharacter,
      categories: data.categories.map(
        (value) => this.categories[value.category - 1].categoryName
      ),
      links: data.links.map((value) => this.links[value.link - 1].linkName),
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
    if (this.componentRefs) {
      this.componentRefs.destroy();
    }
    this.createCard();
  }
  card = viewChild.required('card', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardComponent> | null = null;

  createCard() {
    const componentRef = this.card().createComponent(CardComponent, {
      bindings: [
        inputBinding('characterInfo', this.characterInfo),
        inputBinding('passiveDetails', this.passiveDetails),
      ],
    });

    this.componentRefs = componentRef;
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

  ngOnDestroy() {
    this.componentRefs?.destroy();
  }
}
