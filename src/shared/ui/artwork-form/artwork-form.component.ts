import { Component, inject, input, OnInit, output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { artworkFormat } from '../../model';
import { ErrorComponent } from '../../ui';

@Component({
  selector: 'app-artwork-form',
  imports: [ReactiveFormsModule, ErrorComponent],
  templateUrl: './artwork-form.component.html',
  styleUrl: './artwork-form.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ArtworkFormComponent implements OnInit {
  readonly #parentContainer = inject(ControlContainer);
  controlKey = input.required<string>();
  label = input.required<string>();
  artwork = output<FormData>();
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('artwork', file, file.name);
      this.artwork.emit(formData);
      this.parentFormGroup.get('artwork')?.setValue(file.name);
      this.parentFormGroup.get('artwork')?.markAsDirty();
    }
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormControl<string | null>(null, {
        validators: [artworkFormat],
      })
    );
  }
}
