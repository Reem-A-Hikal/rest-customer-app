import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MenuService } from '../services/menu.service';
import { CartFacade } from '../../cart/services/cart.facade';
import { DishCartIntent } from '../models/dish-cart-intent.model';
import { DishCardFeaturedComponent } from '../components/dish-card-featured/dish-card-featured.component';
import { DishCardItemComponent } from '../components/dish-card-item/dish-card-item.component';
import { AppHeaderComponent } from '../../../shared/components/header/header.component';
import { CategoryTabsComponent } from '../components/category-tabs/category-tabs.component';

@Component({
  selector: 'app-menu',
  imports: [
    DishCardItemComponent,
    DishCardFeaturedComponent,
    AppHeaderComponent,
    CategoryTabsComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, OnDestroy {
  private readonly menuService = inject(MenuService);
  private readonly cartFacade = inject(CartFacade);

  private observer?: IntersectionObserver;
  private ignoreSpyUntil = 0;

  readonly loading = this.menuService.loading;
  readonly error = this.menuService.error;
  readonly selectedCategoryId = this.menuService.selectedCategoryId;

  protected readonly menuGroups = computed(() => {
    return this.menuService.menuGroups().map((group) => {
      const promotedCount = group.products.filter((p) => p.isPromoted).length;

      const featured = group.products
        .filter((p) => p.isPromoted)
        .map((product) => ({
          product,
          quantity: this.cartFacade.quantityOf(product.productId),
          isSingle: promotedCount === 1,
        }));

      const regular = group.products
        .filter((p) => !p.isPromoted)
        .map((product) => ({
          product,
          quantity: this.cartFacade.quantityOf(product.productId),
        }));

      return {
        category: group.category,
        featured,
        regular,
      };
    });
  });

  protected readonly categoryTabs = computed(() =>
    this.menuGroups().map((group) => ({
      id: group.category.categoryId,
      name: group.category.name,
    })),
  );

  constructor() {
    effect(() => {
      const ready =
        !this.loading() && !this.error() && this.menuGroups().length > 0;

      if (!ready) return;

      this.observeCategories();
    });
  }

  private observeCategories(): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => this.selectLastVisibleCategory(entries),
      { rootMargin: '-50% 0px -50% 0px' },
    );

    setTimeout(() => this.observeCategorySections());
  }

  private selectLastVisibleCategory(
    entries: IntersectionObserverEntry[],
  ): void {
    if (Date.now() < this.ignoreSpyUntil) return;

    const visibleCategoryIds = entries
      .filter((entry) => entry.isIntersecting)
      .map((entry) => Number(entry.target.id.replace('category-', '')));
    const lastVisibleCategoryId = visibleCategoryIds.at(-1);

    if (lastVisibleCategoryId !== undefined) {
      this.menuService.selectCategory(lastVisibleCategoryId);
    }
  }

  private observeCategorySections(): void {
    this.menuGroups().forEach((group) => {
      const section = document.getElementById(
        `category-${group.category.categoryId}`,
      );
      if (section) this.observer?.observe(section);
    });
  }

  ngOnInit() {
    this.menuService.loadMenu();
  }

  retry(): void {
    this.menuService.loadMenu();
  }

  protected selectCategory(categoryId: number) {
    this.ignoreSpyUntil = Date.now() + 900;
    this.menuService.selectCategory(categoryId);
    document
      .getElementById(`category-${categoryId}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  protected onCartIntent(intent: DishCartIntent): void {
    switch (intent.type) {
      case 'add':
        return this.cartFacade.addItem(intent.product, 1);

      case 'increment':
        return this.cartFacade.increment(intent.productId);

      case 'decrement':
        return this.cartFacade.decrement(intent.productId);

      default: {
        const _exhaustiveCheck: never = intent;
        return _exhaustiveCheck;
      }
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
