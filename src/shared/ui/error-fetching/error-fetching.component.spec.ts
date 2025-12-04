import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { ErrorFetchingComponent } from './error-fetching.component';

describe('ErrorFetchingComponent', () => {
  let component: ErrorFetchingComponent;
  let fixture: ComponentFixture<ErrorFetchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorFetchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorFetchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
