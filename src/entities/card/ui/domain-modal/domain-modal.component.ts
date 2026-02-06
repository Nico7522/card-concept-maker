import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-domain-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './domain-modal.component.html',
  styleUrl: './domain-modal.component.css',
})
export class DomainModalComponent {
  domain = input<{
    domainName: string;
    domainEffect: string;
  }>();
  close = output();
  onClose() {
    this.close.emit();
  }
}
