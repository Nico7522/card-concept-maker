import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { ArtworkFormComponent } from './artwork-form.component';

describe('ArtworkFormComponent', () => {
  let component: ArtworkFormComponent;
  let fixture: ComponentFixture<ArtworkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtworkFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtworkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
