import { FormArray } from '@angular/forms';

export function isValueInArrayDuplicate(
  array: FormArray,
  index: number,
): boolean {
  const values = array.value;
  const currentValue = values[index];

  if (currentValue === null || currentValue === undefined) {
    return false;
  }

  // Trouve le premier index avec cette valeur
  const firstIndex = values.findIndex(
    (value: number) => value === currentValue,
  );

  // Erreur seulement si ce n'est pas la première occurrence
  return firstIndex !== index;
}
