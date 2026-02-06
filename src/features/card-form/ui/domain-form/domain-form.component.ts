import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DomainFormGroup, domainEffectRequired, domainNameRequired } from '../..';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { ErrorComponent } from '~/src/shared/ui';

@Component({
  selector: 'app-domain-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    ErrorComponent,
  ],
  templateUrl: './domain-form.component.html',
  styleUrl: './domain-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class DomainFormComponent implements OnDestroy, OnInit {
  readonly #parentContainer = inject(ControlContainer);
  controlKey = input.required<string>();
  label = input.required<string>();
  get domain() {
    return this.parentFormGroup.get('domain')?.get('hasDomain')?.value;
  }
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormGroup<DomainFormGroup>(
        {
          hasDomain: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          domainName: new FormControl('', {
            nonNullable: true,
          }),
          domainEffect: new FormControl('', {
            nonNullable: true,
          }),
        },
        {
          validators: [domainNameRequired, domainEffectRequired],
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
