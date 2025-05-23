import { Component, input, output } from '@angular/core';
import { Character } from '../../types/character.type';
import { SuperAttack } from '../../types/super-attack.type';

@Component({
  selector: 'app-super-attack-details',
  imports: [],
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
