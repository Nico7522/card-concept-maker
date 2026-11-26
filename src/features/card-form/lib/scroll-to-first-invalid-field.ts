/**
 * Scrolls to the first visible invalid field of a form and focuses it.
 *
 * Angular sets `ng-invalid` on every invalid control and on its parent groups,
 * so only the innermost invalid elements are kept: a group is targeted only
 * when its own validator fails (e.g. a required active skill name) while its
 * controls are valid. `data-invalid="true"` marks invalid areas that are not
 * form controls (e.g. the transformation card selector).
 */
export function scrollToFirstInvalidField(container: HTMLElement): void {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>('.ng-invalid, [data-invalid="true"]'),
  );

  const firstInvalidField = candidates.find(
    (element) =>
      // Visible only (e.g. the hidden transformed card form is skipped)
      element.offsetParent !== null &&
      !element.querySelector('.ng-invalid, [data-invalid="true"]'),
  );
  if (!firstInvalidField) return;

  firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const focusTarget = firstInvalidField.matches('input, textarea, select')
    ? firstInvalidField
    : firstInvalidField.querySelector<HTMLElement>('input, textarea, select');
  focusTarget?.focus({ preventScroll: true });
}
