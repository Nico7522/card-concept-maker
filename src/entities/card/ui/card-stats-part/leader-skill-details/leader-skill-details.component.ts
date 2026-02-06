import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-leader-skill-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './leader-skill-details.component.html',
  styleUrl: './leader-skill-details.component.css',
})
export class LeaderSkillDetailsComponent {
  leaderSkill = input.required<string>();
}
