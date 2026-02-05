import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { SuperAttackDetailsModalComponent } from './super-attack-details-modal.component';

describe('SuperAttackDetailsModalComponent', () => {
  let component: SuperAttackDetailsModalComponent;
  let fixture: ComponentFixture<SuperAttackDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAttackDetailsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAttackDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
