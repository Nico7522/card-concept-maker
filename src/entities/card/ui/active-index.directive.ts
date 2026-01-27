import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[appActiveIndex]',
  host: {
    '[class]': 'activeClass()'
  }
})
export class ActiveIndexDirective {
  index = input.required<number>();
  activeIndex = input.required<number>();
  activeClass = computed(() => 
    this.index() === this.activeIndex() 
      ? 'w-4 h-4 rounded-full bg-orange-500' 
      : 'w-4 h-4 rounded-full bg-gray-500'
  );
}
