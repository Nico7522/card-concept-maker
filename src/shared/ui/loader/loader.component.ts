import { ChangeDetectionStrategy, Component, input } from '@angular/core';


@Component({
  selector: 'app-loader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  isVisible = input<boolean>(false);
}
