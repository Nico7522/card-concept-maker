import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderSkillDetailsComponent } from './leader-skill-details.component';

describe('LeaderSkillDetailsComponent', () => {
  let component: LeaderSkillDetailsComponent;
  let fixture: ComponentFixture<LeaderSkillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderSkillDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderSkillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
