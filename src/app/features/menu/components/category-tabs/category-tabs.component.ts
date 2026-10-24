import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
export interface CategoryTab {
  id: number;
  name: string;
}
@Component({
  selector: 'app-category-tabs',
  imports: [TranslocoPipe],
  templateUrl: './category-tabs.component.html',
})
export class CategoryTabsComponent {
  readonly tabs = input.required<CategoryTab[]>();
  readonly activeId = input<CategoryTab['id'] | null>(null);
  readonly tabSelected = output<CategoryTab['id']>();

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
