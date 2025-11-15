import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassiveFormComponent } from './passive-form.component';

describe('PassiveFormComponent', () => {
  let component: PassiveFormComponent;
  let fixture: ComponentFixture<PassiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassiveFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PassiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
