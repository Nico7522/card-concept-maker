import { FormControl } from '@angular/forms';

export interface ActiveSkillFormGroup {
  hasActiveSkill: FormControl<boolean>;
  activeSkillName: FormControl<string>;
  activeSkillCondition: FormControl<string>;
  activeSkillEffect: FormControl<string>;
}
