import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-successfully-submitted',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './successfully-submitted.component.html',
  styleUrl: './successfully-submitted.component.css',
})
export class SuccessfullySubmittedComponent {}
