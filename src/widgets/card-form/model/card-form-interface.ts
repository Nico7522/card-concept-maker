import { FormControl, FormGroup } from '@angular/forms';
import { BaseStatFormGroup } from '~/src/shared/model/base-stat-form-group-interface';
import { CategoriesFormGroup } from '~/src/shared/model/categories-form-group-interface';
import { LinksFormGroup } from '~/src/shared/model/links-form-group-interface';
import { PassiveFormGroup } from '~/src/shared/model/passive-form-group-interface';
import { SuperAttackFormGroup } from '~/src/shared/model/super-attack-form-group-interface';
import { ActiveSkillFormGroup } from '~/src/shared/model/active-skill-form-group-interface';
import { DomainFormGroup } from '~/src/shared/model/domain-form-group-interface';

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
