import { CanDeactivateFn } from '@angular/router';
import { HasUnsavedChanges } from '../../model/has-unsavec-changes-interface';

export const hasUnsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (
  component: HasUnsavedChanges,
  currentRoute,
  currentState,
  nextState
) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
