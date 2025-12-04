import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { SuperAttackDetailsComponent } from './super-attack-details.component';

describe('SuperAttackDetailsComponent', () => {
  let component: SuperAttackDetailsComponent;
  let fixture: ComponentFixture<SuperAttackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAttackDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAttackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
