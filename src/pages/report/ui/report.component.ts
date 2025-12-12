import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { ReportService } from '../api/report.service';
import { LoaderComponent } from '~/src/shared/ui';
import { ErrorToastService } from '~/src/shared/api';
import { catchError, EMPTY } from 'rxjs';
import { SuccessfullySubmittedComponent } from './successfully-submitted/successfully-submitted.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectComponent,
    NgOptionComponent,
    LoaderComponent,
    SuccessfullySubmittedComponent,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnDestroy {
  readonly #destroyRef = inject(DestroyRef);
  readonly #reportService = inject(ReportService);
  readonly #errorToastService = inject(ErrorToastService);
  isLoading = signal(false);
  isSubmittedSuccessfully = signal(false);
  reportForm = new FormGroup({
    type: new FormControl('issue', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.reportForm.valid) {
      this.isLoading.set(true);
      this.#reportService
        .report(this.reportForm.getRawValue())
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          catchError(() => {
            this.#errorToastService.showToast('Error submitting report');
            this.isLoading.set(false);
            return EMPTY;
          })
        )
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.isSubmittedSuccessfully.set(true);
            this.reportForm.reset({ type: 'issue', message: '' });
          },
        });
    }
  }

  ngOnDestroy() {
    this.isLoading.set(false);
    this.isSubmittedSuccessfully.set(false);
    this.reportForm.reset({ type: 'issue', message: '' });
  }
}
