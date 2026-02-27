import {
  ChangeDetectionStrategy,
  Component,
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
import { NgIconComponent } from '@ng-icons/core';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { GameDataService } from '~/src/shared/api';
import { CategoriesFormGroup } from '../../model/categories-form-group-interface';
import { categoryAlreadySelected } from '../../model/validators';
import { isValueInArrayDuplicate } from '../../lib/is-value-in-array-duplicate';
import { ErrorComponent } from '~/src/shared/ui';

@Component({
  selector: 'app-categories-form',
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    NgIconComponent,
    ErrorComponent,
  ],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  readonly gameDataService = inject(GameDataService);
  categoryList = this.gameDataService.categories;
  controlKey = input.required<string>();
  label = input.required<string>();
  isValueInArrayDuplicate = isValueInArrayDuplicate;
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<CategoriesFormGroup>(
        {
          categories: new FormArray([
            new FormControl(1, {
              nonNullable: true,
              validators: [Validators.required],
            }),
          ]),
        },
        {
          validators: [categoryAlreadySelected],
        },
      ),
    );
  }

  get categories() {
    const formGroup = this.parentFormGroup.get(this.controlKey()) as FormArray;
    return formGroup.get('categories') as FormArray;
  }

  removeCategory(index: number) {
    this.categories.removeAt(index);
  }

  addCategory() {
    this.categories.push(
      new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }
}
