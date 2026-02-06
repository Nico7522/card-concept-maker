import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-card-links-part',
  imports: [],
  templateUrl: './card-links-part.component.html',
  styleUrl: './card-links-part.component.css',
})
export class CardLinksPartComponent {
  links = input.required<string[]>();
  labels = signal<number[]>(Array(8).fill(0));

  fullLinksArray = computed(() => {
    const links = this.links();
    return Array.from({ length: 7 }, (_, i) => links[i] ?? ' - ');
  });
}
