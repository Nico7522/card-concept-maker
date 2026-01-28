import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card-links-part',
  imports: [NgOptimizedImage],
  templateUrl: './card-links-part.component.html',
  styleUrl: './card-links-part.component.css',
})
export class CardLinksPartComponent {
  links = input.required<string[]>();
}
