import { CanDeactivateFn } from '@angular/router';
import { HasUnsavedChanges } from '../model/has-unsaved-changes.interface';

export const hasUnsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (
  component: HasUnsavedChanges,
) => {
  console.log('hasUnsavedChangesGuard');

  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
