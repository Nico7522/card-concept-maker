import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCategoriesPartComponent } from './card-categories-part.component';

describe('CardCategoriesPartComponent', () => {
  let component: CardCategoriesPartComponent;
  let fixture: ComponentFixture<CardCategoriesPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCategoriesPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCategoriesPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
