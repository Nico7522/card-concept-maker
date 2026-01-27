import { describe, expect, it } from 'vitest';
import { ActiveIndexDirective } from './active-index.directive';

describe('ActiveClassnameDirective', () => {
  it('should create an instance', () => {
    const directive = new ActiveIndexDirective();
    expect(directive).toBeTruthy();
  });
});
