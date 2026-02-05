import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSkillDetailsComponent } from './active-skill-details.component';

describe('ActiveSkillDetailsComponent', () => {
  let component: ActiveSkillDetailsComponent;
  let fixture: ComponentFixture<ActiveSkillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveSkillDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveSkillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
