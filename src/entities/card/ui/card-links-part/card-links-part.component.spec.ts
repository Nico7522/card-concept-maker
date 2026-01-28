import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLinksPartComponent } from './card-links-part.component';

describe('CardLinksPartComponent', () => {
  let component: CardLinksPartComponent;
  let fixture: ComponentFixture<CardLinksPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLinksPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLinksPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
