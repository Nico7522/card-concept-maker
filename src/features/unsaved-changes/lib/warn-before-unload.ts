import { DestroyRef, DOCUMENT, inject } from '@angular/core';
import { HasUnsavedChanges } from '../model/has-unsaved-changes.interface';

/**
 * Asks the browser to confirm before closing the tab or reloading the page
 * while there are unsaved changes. Complements hasUnsavedChangesGuard, which
 * only covers navigation inside the app.
 *
 * Must be called in an injection context (e.g. a field initializer).
 * The listener is removed when the component is destroyed.
 */
export function warnBeforeUnload(component: HasUnsavedChanges): void {
  const window = inject(DOCUMENT).defaultView;
  if (!window) return;

  const onBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!component.hasUnsavedChanges()) return;
    // The browser shows its own generic message: custom texts are ignored
    event.preventDefault();
    event.returnValue = ''; // Required by older browsers
  };

  window.addEventListener('beforeunload', onBeforeUnload);
  inject(DestroyRef).onDestroy(() =>
    window.removeEventListener('beforeunload', onBeforeUnload),
  );
}
