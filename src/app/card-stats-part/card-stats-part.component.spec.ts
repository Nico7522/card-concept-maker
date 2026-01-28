import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStatsPartComponent } from './card-stats-part.component';

describe('CardStatsPartComponent', () => {
  let component: CardStatsPartComponent;
  let fixture: ComponentFixture<CardStatsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardStatsPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardStatsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
