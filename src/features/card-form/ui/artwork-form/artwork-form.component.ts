import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorComponent } from '~/src/shared/ui';
import {
  artworkFormat,
  artworkMaxSize,
  MAX_ARTWORK_SIZE_BYTES,
  MAX_ARTWORK_SIZE_MB,
} from '../../model/validators';

@Component({
  selector: 'app-artwork-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class ArtworkFormComponent implements OnInit, OnDestroy {
  readonly #parentContainer = inject(ControlContainer);
  controlKey = input.required<string>();
  label = input.required<string>();
  artwork = output<FormData>();
  readonly maxArtworkSizeMb = MAX_ARTWORK_SIZE_MB;
  #isFileTooLarge = false;
  get parentFormGroup(): FormGroup {
    return this.#parentContainer.control as FormGroup;
  }
  get artworkForm(): FormControl<string | null> {
    return this.parentFormGroup.get(this.controlKey()) as FormControl<
      string | null
    >;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Checked before saving: the API would reject the file after the card is created
      this.#isFileTooLarge = file.size > MAX_ARTWORK_SIZE_BYTES;
      if (!this.#isFileTooLarge) {
        const formData = new FormData();
        formData.append('artwork', file, file.name);
        this.artwork.emit(formData);
      }
      // setValue re-runs the validators, including the size check
      this.artworkForm.setValue(file.name);
      this.artworkForm.markAsDirty();
    }
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(
      this.controlKey(),
      new FormControl<string | null>(null, {
        validators: [
          artworkFormat,
          artworkMaxSize(() => this.#isFileTooLarge),
        ],
      }),
    );
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
