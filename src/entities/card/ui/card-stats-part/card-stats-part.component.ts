import { Component, input, signal } from '@angular/core';
import { SuperAttack } from '../../model/super-attack-type';
import { LeaderSkillDetailsComponent } from '../leader-skill-details/leader-skill-details.component';

@Component({
  selector: 'app-card-stats-part',
  imports: [LeaderSkillDetailsComponent],
  templateUrl: './card-stats-part.component.html',
  styleUrl: './card-stats-part.component.css',
})
export class CardStatsPartComponent {
  isLeaderSkillDetailsShown = signal(false);
  stats = input<{
    attack: number;
    defense: number;
    hp: number;
  }>();

  isLegendaryCharacter = input.required<boolean>();
  superAttackInfo = input.required<SuperAttack>();
  leaderSkill = input.required<string>();

  showFullLeaderSkill() {
    this.isLeaderSkillDetailsShown.set(true);
  }

  hideFullLeaderSkill() {
    this.isLeaderSkillDetailsShown.set(false);
  }
}
