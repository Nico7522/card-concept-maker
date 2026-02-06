import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActiveSkill } from '~/src/entities/card/model/character-type';

@Component({
  selector: 'app-active-skill-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './active-skill-details.component.html',
  styleUrl: './active-skill-details.component.css',
})
export class ActiveSkillDetailsComponent {
  activeSkill = input<ActiveSkill>();
}
