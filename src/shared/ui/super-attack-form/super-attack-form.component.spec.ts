import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAttackFormComponent } from './super-attack-form.component';

describe('SuperAttackFormComponent', () => {
  let component: SuperAttackFormComponent;
  let fixture: ComponentFixture<SuperAttackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAttackFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAttackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
