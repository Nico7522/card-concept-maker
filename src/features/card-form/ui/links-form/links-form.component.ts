import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { NgIcon } from '@ng-icons/core';
import { GameDataService } from '~/src/shared/api';
import {
  isValueInArrayDuplicate,
  linkAlreadySelected,
  LinksFormGroup,
} from '../..';
import { ErrorComponent } from '~/src/shared/ui';

@Component({
  selector: 'app-links-form',
  imports: [
    NgSelectComponent,
    NgOptionComponent,
    NgIcon,
    ReactiveFormsModule,
    ErrorComponent,
  ],
  templateUrl: './links-form.component.html',
  styleUrl: './links-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class LinksFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  readonly gameDataService = inject(GameDataService);
  controlKey = input.required<string>();
  label = input.required<string>();
  isValueInArrayDuplicate = isValueInArrayDuplicate;
  linkSkill = this.gameDataService.links;
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<LinksFormGroup>(
        {
          links: new FormArray([
            new FormControl(1, {
              nonNullable: true,
              validators: [Validators.required],
            }),
          ]),
        },
        {
          validators: [linkAlreadySelected],
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }

  // get links
  get links() {
    const formGroup = this.parentFormGroup.get(this.controlKey()) as FormArray;
    return formGroup.get('links') as FormArray;
  }

  // remove a links
  removeLink(index: number) {
    this.links.removeAt(index);
  }

  // Add a links
  addLink() {
    this.links.push(
      new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    );
  }
}
