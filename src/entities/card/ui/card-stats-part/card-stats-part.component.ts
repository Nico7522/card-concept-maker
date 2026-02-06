import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { SuperAttack } from '../../model/super-attack-type';
import { LeaderSkillDetailsComponent } from './leader-skill-details/leader-skill-details.component';
import { Character } from '../../model/character-type';

@Component({
  selector: 'app-card-stats-part',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LeaderSkillDetailsComponent],
  templateUrl: './card-stats-part.component.html',
  styleUrl: './card-stats-part.component.css',
})
export class CardStatsPartComponent {
  isAmodalOpen = input.required<boolean>();
  stats = input<{
    attack: number;
    defense: number;
    hp: number;
  }>();

  isLegendaryCharacter = input.required<boolean>();
  superAttackInfo = input.required<SuperAttack>();
  leaderSkill = input.required<string>();
  characterInfo = input.required<Character>();
  openSuperAttackDetails = output<void>();
  isLeaderSkillDetailsShown = signal(false);

  showFullLeaderSkill() {
    this.isLeaderSkillDetailsShown.set(true);
  }

  hideFullLeaderSkill() {
    this.isLeaderSkillDetailsShown.set(false);
  }

  showFullSuperAttackDetails() {
    this.openSuperAttackDetails.emit();
  }
}
