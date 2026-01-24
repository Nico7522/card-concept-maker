import { Component, input, output } from '@angular/core';
import { Character, SuperAttack } from '../..';
import { KiMeterComponent } from '../ki-meter/ki-meter.component';

@Component({
  selector: 'app-super-attack-details',
  imports: [KiMeterComponent],
  templateUrl: './super-attack-details.component.html',
  styleUrl: './super-attack-details.component.css',
})
export class SuperAttackDetailsComponent {
  characterInfo = input.required<Character>();
  superAttackInfo = input.required<SuperAttack>();

  close = output();
  onClose() {
    this.close.emit();
  }
}
