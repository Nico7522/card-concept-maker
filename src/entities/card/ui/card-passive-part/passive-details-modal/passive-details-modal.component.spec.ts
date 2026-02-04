import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassiveDetailsModalComponent } from './passive-details-modal.component';

describe('PassiveDetailsModalComponent', () => {
  let component: PassiveDetailsModalComponent;
  let fixture: ComponentFixture<PassiveDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassiveDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassiveDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
