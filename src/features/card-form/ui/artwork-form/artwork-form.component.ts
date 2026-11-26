import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { environment } from '~/src/environments/environment';
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
  readonly #destroyRef = inject(DestroyRef);
  controlKey = input.required<string>();
  label = input.required<string>();
  artwork = output<FormData>();
  readonly maxArtworkSizeMb = MAX_ARTWORK_SIZE_MB;
  #isFileTooLarge = false;

  // Local preview of the picked file (object URL, nothing is uploaded)
  readonly #localPreviewUrl = signal<string | null>(null);
  // Once a file is picked, the saved artwork is no longer the one to show
  readonly #hasPickedFile = signal(false);
  // File name held by the control: the saved artwork when editing a card
  readonly #artworkValue = signal<string | null>(null);

  // URL that failed to load (e.g. saved artwork missing on the server): hidden
  readonly #failedPreviewUrl = signal<string | null>(null);

  readonly previewUrl = computed(() => {
    const url = this.#hasPickedFile()
      ? this.#localPreviewUrl()
      : this.#savedArtworkUrl();
    return url && url !== this.#failedPreviewUrl() ? url : null;
  });

  readonly #savedArtworkUrl = computed(() => {
    const savedArtwork = this.#artworkValue();
    return savedArtwork ? `${environment.apiUrl}/${savedArtwork}` : null;
  });

  onPreviewError(url: string) {
    this.#failedPreviewUrl.set(url);
  }
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
      this.#hasPickedFile.set(true);
      this.#setLocalPreview(this.artworkForm.valid ? file : null);
    }
  }

  #setLocalPreview(file: File | null) {
    const previousUrl = this.#localPreviewUrl();
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    this.#localPreviewUrl.set(file ? URL.createObjectURL(file) : null);
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
    // Follows the saved artwork patched in by the update page
    this.artworkForm.valueChanges
      .pipe(startWith(this.artworkForm.value), takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => this.#artworkValue.set(value));
  }

  ngOnDestroy(): void {
    this.#setLocalPreview(null);
    this.parentFormGroup.removeControl(this.controlKey());
  }
}
