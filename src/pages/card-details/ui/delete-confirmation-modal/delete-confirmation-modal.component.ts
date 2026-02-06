import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { UbButtonDirective } from '~/components/ui/button';

@Component({
  selector: 'app-delete-confirmation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UbButtonDirective],
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrl: './delete-confirmation-modal.component.css',
})
export class DeleteConfirmationModalComponent {
  confirm = output<boolean>();

  onConfirm() {
    this.confirm.emit(true);
  }

  onClose() {
    this.confirm.emit(false);
  }
}
