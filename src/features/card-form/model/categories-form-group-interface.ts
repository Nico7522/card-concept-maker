import { FormArray, FormControl } from '@angular/forms';

export interface CategoriesFormGroup {
  categories: FormArray<FormControl<number>>;
}
