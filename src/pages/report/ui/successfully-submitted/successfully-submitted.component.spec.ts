import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullySubmittedComponent } from './successfully-submitted.component';

describe('SuccessfullySubmittedComponent', () => {
  let component: SuccessfullySubmittedComponent;
  let fixture: ComponentFixture<SuccessfullySubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessfullySubmittedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfullySubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
