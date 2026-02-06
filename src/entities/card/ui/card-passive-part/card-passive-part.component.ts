import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { ActiveSkill } from '../..';
import { ActiveSkillDetailsComponent } from './active-skill-details/active-skill-details.component';

@Component({
  selector: 'app-card-passive-part',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActiveSkillDetailsComponent],
  templateUrl: './card-passive-part.component.html',
  styleUrl: './card-passive-part.component.css',
})
export class CardPassivePartComponent {
  isAmodalOpen = input.required<boolean>();
  passiveName = input<string>();
  activeSkill = input<ActiveSkill>();
  openPassiveDetailsModal = output<void>();
  isActiveSkillDetailsShown = signal(false);

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
