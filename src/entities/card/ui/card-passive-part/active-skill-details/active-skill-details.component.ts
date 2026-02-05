import { Component, input } from '@angular/core';
import { ActiveSkill } from '../../../model/character-type';

@Component({
  selector: 'app-active-skill-details',
  imports: [],
  templateUrl: './active-skill-details.component.html',
  styleUrl: './active-skill-details.component.css',
})
export class ActiveSkillDetailsComponent {
  activeSkill = input<ActiveSkill>();
}
