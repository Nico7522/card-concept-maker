import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPassivePartComponent } from './card-passive-part.component';

describe('CardPassivePartComponent', () => {
  let component: CardPassivePartComponent;
  let fixture: ComponentFixture<CardPassivePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPassivePartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPassivePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
