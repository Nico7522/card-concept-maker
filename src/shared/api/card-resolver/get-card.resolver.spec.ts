import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { getCardResolver } from './get-card.resolver';

describe('getCardResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => getCardResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
