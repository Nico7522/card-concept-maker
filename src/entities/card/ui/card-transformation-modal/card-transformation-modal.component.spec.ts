import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTransformationModalComponent } from './card-transformation-modal.component';

describe('CardTransformationModalComponent', () => {
  let component: CardTransformationModalComponent;
  let fixture: ComponentFixture<CardTransformationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTransformationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTransformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
