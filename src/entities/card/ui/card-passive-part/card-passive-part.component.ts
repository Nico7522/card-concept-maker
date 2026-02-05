import { Component, input, output, signal } from '@angular/core';
import { ActiveSkill } from '../..';
import { ActiveSkillDetailsComponent } from './active-skill-details/active-skill-details.component';

@Component({
  selector: 'app-card-passive-part',
  imports: [ActiveSkillDetailsComponent],
  templateUrl: './card-passive-part.component.html',
  styleUrl: './card-passive-part.component.css',
})
export class CardPassivePartComponent {
  isActiveSkillDetailsShown = signal(false);
  isAmodalOpen = input.required<boolean>();
  activeSkill = input<ActiveSkill>();
  openPassiveDetailsModal = output<void>();

  showFullPassiveDetails() {
    this.openPassiveDetailsModal.emit();
  }

  showActiveSkillDetails() {
    this.isActiveSkillDetailsShown.set(true);
  }

  hideActiveSkillDetails() {
    this.isActiveSkillDetailsShown.set(false);
  }
}
