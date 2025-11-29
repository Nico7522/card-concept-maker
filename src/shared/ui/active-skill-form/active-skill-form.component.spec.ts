import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSkillFormComponent } from './active-skill-form.component';

describe('ActiveSkillFormComponent', () => {
  let component: ActiveSkillFormComponent;
  let fixture: ComponentFixture<ActiveSkillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveSkillFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveSkillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
