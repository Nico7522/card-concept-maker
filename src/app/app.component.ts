import {
  Component,
  ComponentRef,
  HostListener,
  inject,
  inputBinding,
  OnDestroy,
  OnInit,
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
import { toSignal } from '@angular/core/rxjs-interop';
import { of, Subject, take } from 'rxjs';
import {
  activeSkillConditionRequired,
  activeSkillEffectRequired,
  activeSkillNameRequired,
  ultraSuperAttackRequired,
} from './helpers/validators';
import { Character } from './types/character.type';
import { Passive } from './types/passive.type';
import { SuperAttack } from './types/super-attack.type';
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
export class AppComponent implements OnInit, OnDestroy {
  isFormUntouched = signal(true);
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    const confirmationMessage = 'Are you sure ?';
    (event as BeforeUnloadEvent).returnValue = confirmationMessage;
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe()
      .subscribe((x) => this.isFormUntouched.set(false));
  }
  private readonly formBuilder = inject(NonNullableFormBuilder);
  passiveConditionActivation = passiveConditionActivation;
  effectDuration = effectDuration;
  categories = categories;
  links = Links;
  characterInfo = signal<Character>(null);
  passiveDetails = signal<Passive>(null);
  superAttackInfo = signal<SuperAttack>(null);
  isFirstPartShow = signal(true);
  title = signal('Card Details');
  canQuit$: Subject<boolean> = new Subject<boolean>();
  form = this.formBuilder.group(
    {
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
      superAttackName: new FormControl('', {
        nonNullable: true,
      }),
      superAttack: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      ultraSuperAttackName: new FormControl('', {
        nonNullable: true,
      }),
      ultraSuperAttack: new FormControl('', {
        nonNullable: true,
      }),
      isLegendaryCharacter: new FormControl(false, {
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
      passiveName: new FormControl(''),
      passivePart: this.formBuilder.array([
        this.formBuilder.group({
          passiveConditionActivation: new FormControl(1, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          customPassiveConditionActivation: new FormControl(''),
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
      hasActiveSkill: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      activeSkill: this.formBuilder.group({
        activeSkillName: new FormControl(''),
        activeSkillCondition: new FormControl(''),
        activeSkillEffect: new FormControl(''),
      }),
    },
    {
      validators: [
        ultraSuperAttackRequired,
        activeSkillNameRequired,
        activeSkillConditionRequired,
        activeSkillEffectRequired,
      ],
    }
  );
  isLegendaryCharacter = toSignal(
    this.form.get('isLegendaryCharacter')?.valueChanges ?? of(null)
  );

  ActiveSkill = toSignal(
    this.form.get('hasActiveSkill')?.valueChanges ?? of(null)
  );

  // Return true if custom condition option is selected.
  isCustomConditionSelected(index: number): boolean {
    const control = this.getPassiveParts().at(index);
    return control.get('passiveConditionActivation')?.value === 'custom';
  }

  // Check whenever the passive condition select change and show the custom passive input when custom condition option is selected.
  onOptionChange(event: any, index: number) {
    const control = this.getPassiveParts().at(index);
    if (event === 'custom') {
      control.get('customPassiveConditionActivation')?.enable();
    } else {
      control.get('customPassiveConditionActivation')?.disable();
      control.get('customPassiveConditionActivation')?.reset();
    }
  }

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
        customPassiveConditionActivation: new FormControl(''),
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

    if (this.form.valid) {
      this.characterInfo.set({
        stats: {
          attack: +data.attack,
          defense: +data.defense,
          hp: +data.hp,
        },
        leaderSkill: data.leaderSkill,
        isLegendaryCharacter: data.isLegendaryCharacter,
        categories: data.categories.map(
          (value) => this.categories[value.category - 1].categoryName
        ),
        links: data.links.map((value) => this.links[value.link - 1].linkName),
        activeSkill: data.hasActiveSkill
          ? {
              activeSkillName: data.activeSkill.activeSkillName ?? '',
              activeSkillCondition: data.activeSkill.activeSkillCondition ?? '',
              activeSkillEffect: data.activeSkill.activeSkillEffect ?? '',
            }
          : null,
      });
      let passiveInfo: Passive = {
        name: data.passiveName ?? '',
        passive: data.passivePart.map((value) => {
          return {
            passiveConditionActivation: value.customPassiveConditionActivation
              ? value.customPassiveConditionActivation
              : this.passiveConditionActivation[
                  value.passiveConditionActivation - 1
                ].effect,
            effect: value.effect.map((e) => {
              return {
                description: e.effectDescription,
                imageSrc:
                  e.effectDuration > 1
                    ? this.getDurationLogo(e.effectDuration)
                    : '',
              };
            }),
          };
        }),
      };
      this.superAttackInfo.set({
        superAttackName: data.superAttackName,
        superAttackEffect: data.superAttack,
        ultraSuperAttackName: data.ultraSuperAttackName,
        ultraSuperAttackEffect: data.ultraSuperAttack,
      });
      this.passiveDetails.set(passiveInfo);

      if (this.componentRefs) {
        this.componentRefs.destroy();
      }
      this.createCard();
    }
  }
  card = viewChild.required('card', { read: ViewContainerRef });
  componentRefs: ComponentRef<CardComponent> | null = null;

  createCard() {
    const componentRef = this.card().createComponent(CardComponent, {
      bindings: [
        inputBinding('characterInfo', this.characterInfo),
        inputBinding('passiveDetails', this.passiveDetails),
        inputBinding('superAttackInfo', this.superAttackInfo),
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
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }
}
