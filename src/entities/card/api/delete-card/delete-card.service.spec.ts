import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest';

import { DeleteCardService } from './delete-card.service';

describe('DeleteCardService', () => {
  let service: DeleteCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
