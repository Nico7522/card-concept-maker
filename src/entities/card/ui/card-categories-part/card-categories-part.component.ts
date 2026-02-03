import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-card-categories-part',
  imports: [],
  templateUrl: './card-categories-part.component.html',
  styleUrl: './card-categories-part.component.css',
})
export class CardCategoriesPartComponent {
  categories = input.required<string[]>();
  fullCategoriesArray = computed(() => {
    const categories = this.categories();
    return Array.from({ length: 9 }, (_, i) => categories[i] ?? ' - ');
  });
}
