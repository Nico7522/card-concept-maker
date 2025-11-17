import {
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

import { UbButtonDirective } from '~/components/ui/button';
import { categories } from '~/src/app/select-options/categories';
import { CategoriesFormGroup } from '../../model/categories-form-group-interface';
@Component({
  selector: 'app-categories-form',
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    UbButtonDirective,
    NgIconComponent,
  ],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  readonly #destroyRef = inject(DestroyRef);
  categoryList = categories;
  controlKey = input.required<string>();
  label = input.required<string>();

  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }
  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<CategoriesFormGroup>({
        categories: new FormArray([
          new FormControl(1, {
            nonNullable: true,
            validators: [Validators.required],
          }),
        ]),
      })
    );
  }

  get categories() {
    const formGroup = this.parentFormGroup.get(this.controlKey()) as FormArray;
    return formGroup.get('categories') as FormArray;
  }

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  // Add a category
  addCategory() {
    this.categories.push(
      new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required],
      })
    );
  }
}
