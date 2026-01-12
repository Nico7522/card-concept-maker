import { FormControl } from '@angular/forms';

export interface DomainFormGroup {
  hasDomain: FormControl<boolean>;
  domainName: FormControl<string>;
  domainEffect: FormControl<string>;
}
