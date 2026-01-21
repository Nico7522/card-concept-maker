import { FormControl, FormGroup } from '@angular/forms';
import { BaseStatFormGroup } from '~/src/features/card-form/model/base-stat-form-group-interface';
import { CategoriesFormGroup } from '~/src/features/card-form/model/categories-form-group-interface';
import { LinksFormGroup } from '~/src/features/card-form/model/links-form-group-interface';
import { PassiveFormGroup } from '~/src/features/card-form/model/passive-form-group-interface';
import { SuperAttackFormGroup } from '~/src/features/card-form/model/super-attack-form-group-interface';
import { ActiveSkillFormGroup } from '~/src/features/card-form/model/active-skill-form-group-interface';
import { DomainFormGroup } from '~/src/features/card-form/model/domain-form-group-interface';

export interface CardForm {
  cardName: FormControl<string>;
  artwork: FormControl<string | null>;
  type: FormControl<string>;
  class: FormControl<string>;
  stats: FormGroup<BaseStatFormGroup>;
  isLegendary: FormControl<boolean>;
  leaderSkill: FormControl<string>;
  superAttack: FormGroup<SuperAttackFormGroup>;
  categories: FormGroup<CategoriesFormGroup>;
  links: FormGroup<LinksFormGroup>;
  passive: FormGroup<PassiveFormGroup>;
  activeSkill: FormGroup<ActiveSkillFormGroup>;
  domain: FormGroup<DomainFormGroup>;
}
