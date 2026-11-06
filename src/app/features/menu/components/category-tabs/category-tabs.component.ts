import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
export interface CategoryTab<T extends string | number = number> {
  id: T;
  name: string;
  count?: number;
}
@Component({
  selector: 'app-category-tabs',
  templateUrl: './category-tabs.component.html',
})
export class CategoryTabsComponent<T extends string | number = number> {
  readonly tabs = input.required<CategoryTab<T>[]>();
  readonly activeId = input<T | null>(null);
  readonly tabSelected = output<T>();
  readonly label = input('Menu Categories');
  readonly isSticky = input(true);

  private readonly list = viewChild<ElementRef<HTMLElement>>('list');

  readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  constructor() {
    effect(() => {
      const id = this.activeId();
      const list = this.list()?.nativeElement;
      if (id === null || !list) return;

      const tab = list.querySelector<HTMLElement>(`[data-tab-id="${id}"]`);
      if (!tab) return;

      const listRect = list.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      const offset =
        tabRect.left + tabRect.width / 2 - (listRect.left + listRect.width / 2);

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      list?.scrollBy({
        left: offset,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
  }
}
