import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { UpdateCardService } from './update-card.service';

describe('UpdateCardService', () => {
  let service: UpdateCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
