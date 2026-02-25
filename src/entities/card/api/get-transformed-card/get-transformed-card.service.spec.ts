import { TestBed } from '@angular/core/testing';

import { GetTransformedCardService } from './get-transformed-card.service';

describe('GetTransformedCardService', () => {
  let service: GetTransformedCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTransformedCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
