import { FormControl } from '@angular/forms';

export interface BaseStatFormGroup {
  attack: FormControl<number | null>;
  defense: FormControl<number | null>;
  hp: FormControl<number | null>;
}
