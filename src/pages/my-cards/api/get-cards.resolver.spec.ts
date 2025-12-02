import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { getCardsResolver } from './get-cards.resolver';
import { Card } from '~/src/shared/model';

describe('getCardsResolver', () => {
  const executeResolver: ResolveFn<Card[]> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      getCardsResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
