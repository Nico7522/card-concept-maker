import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-fetching',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  templateUrl: './error-fetching.component.html',
  styleUrl: './error-fetching.component.css',
})
export class ErrorFetchingComponent {
  message = input.required<string>();
}
