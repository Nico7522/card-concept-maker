import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  errorMessage = input.required<string>();
}
