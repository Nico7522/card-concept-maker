import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ki-meter',
  imports: [NgClass],
  host: { style: 'display: contents' },
  template: `@for (ki of nbKiArray(); track $index) {
    <div [ngClass]="className()"></div>
  }`
})
export class KiMeterComponent {
  // Number of ki to display
  nbKi = input.required<number>();
  // Background color class name
  bgColorClassName = input.required<string>();
  // Height class name
  heightClassName = input.required<string>();

  // Computed signal used to create an array based on the number of ki to display
  nbKiArray = computed(() => {
    return Array.from({ length: this.nbKi() }, (_, index) => index);
  });

  // Computed signal used to create the class name for the ki meter
  className = computed(() => {
    return `border border-black w-2 xl:w-3 ${this.heightClassName()} ${this.bgColorClassName()}`;
  });
}
