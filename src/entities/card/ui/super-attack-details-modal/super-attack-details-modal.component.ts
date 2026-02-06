import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Character, SuperAttack } from '../..';
import { KiMeterComponent } from '../ki-meter/ki-meter.component';

@Component({
  selector: 'app-super-attack-details-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KiMeterComponent],
  templateUrl: './super-attack-details-modal.component.html',
  styleUrl: './super-attack-details-modal.component.css',
})
export class SuperAttackDetailsModalComponent {
  characterInfo = input.required<Character>();
  superAttackInfo = input.required<SuperAttack>();

  close = output();
  onClose() {
    this.close.emit();
  }
}
