import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
export interface CategoryTab {
  id: number;
  name: string;
}
@Component({
  selector: 'app-category-tabs',
  templateUrl: './category-tabs.component.html',
})
export class CategoryTabsComponent {
  readonly tabs = input.required<CategoryTab[]>();
  readonly activeId = input<CategoryTab['id'] | null>(null);
  readonly tabSelected = output<CategoryTab['id']>();

  readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  constructor() {
    effect(() => {
      const id = this.activeId();
      if (id === null) return;

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      this.host.nativeElement
        .querySelector<HTMLElement>('[data-tab-id="${id}"]')
        ?.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: reduceMotion ? 'auto' : 'smooth',
        });
    });
  }
}
