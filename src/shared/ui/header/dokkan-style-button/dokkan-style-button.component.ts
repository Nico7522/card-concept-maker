import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dokkan-style-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  templateUrl: './dokkan-style-button.component.html',
  styleUrl: './dokkan-style-button.component.css',
})
export class DokkanStyleButtonComponent {
  text = input.required<string>();
  icon = input.required<string>();
  alt = input.required<string>();
  navigateTo = input<string[]>();
  isMobileVersion = input<boolean>();
}
