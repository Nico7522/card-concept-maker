import { FormControl } from '@angular/forms';

export interface SuperAttackFormGroup {
  superAttackName: FormControl<string>;
  superAttackEffect: FormControl<string>;
  ultraSuperAttackName: FormControl<string>;
  ultraSuperAttackEffect: FormControl<string>;
}
