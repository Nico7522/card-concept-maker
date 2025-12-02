import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { getCardResolver } from './get-card.resolver';
import { Card } from '../../model';

describe('getCardResolver', () => {
  const executeResolver: ResolveFn<Card> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => getCardResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
