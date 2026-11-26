import {
  ChangeDetectionStrategy,
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
import { AuthService, ErrorToastService } from '~/src/shared/api';
import { catchError, EMPTY } from 'rxjs';
import { SuccessfullySubmittedComponent } from './successfully-submitted/successfully-submitted.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Email } from '../models/email-interfaces';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

// Same limit as the API (/send-email rejects longer messages)
const MAX_MESSAGE_LENGTH = 5000;

@Component({
  selector: 'app-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly maxMessageLength = MAX_MESSAGE_LENGTH;
  readonly #destroyRef = inject(DestroyRef);
  readonly #reportService = inject(ReportService);
  readonly #errorToastService = inject(ErrorToastService);
  readonly #authService = inject(AuthService);
  isLoading = signal(false);
  isSubmittedSuccessfully = signal(false);
  reportForm = new FormGroup({
    type: new FormControl('issue', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        // The API rejects messages made only of whitespace
        Validators.pattern(/\S/),
        Validators.maxLength(MAX_MESSAGE_LENGTH),
      ],
    }),
  });

  onSubmit() {
    if (this.reportForm.valid) {
      this.isLoading.set(true);
      const data = this.reportForm.getRawValue()
      const email: Email = {
        from: this.#authService.user()?.email || '',
        subject: data.type,
        text: data.message,
      }
      this.#reportService
        .report(email)
        .pipe(
          takeUntilDestroyed(this.#destroyRef),
          catchError((error: HttpErrorResponse) => {
            this.#errorToastService.showToast(
              error.status === HttpStatusCode.TooManyRequests
                ? 'Too many messages sent, please try again later'
                : 'Error submitting report',
            );
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
