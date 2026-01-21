import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { CardModalComponent } from './card-modal.component';

describe('CardModalComponent', () => {
  let component: CardModalComponent;
  let fixture: ComponentFixture<CardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
