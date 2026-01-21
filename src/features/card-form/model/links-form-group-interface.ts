import { FormArray, FormControl } from '@angular/forms';

export interface LinksFormGroup {
  links: FormArray<FormControl<number>>;
}
