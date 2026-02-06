import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-card-categories-part',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './card-categories-part.component.html',
  styleUrl: './card-categories-part.component.css',
})
export class CardCategoriesPartComponent {
  categories = input.required<string[]>();
  fullCategoriesArray = computed(() => {
    const categories = this.categories();
    if (categories.length < 10) {
      return [...categories, ...Array(10 - categories.length).fill(' - ')];
    }
    return categories;
  });
}
