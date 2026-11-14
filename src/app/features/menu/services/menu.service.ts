import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Category, MenuGroup, Product } from '../models/menu.model';

interface MenuCategoryResponse extends Category {
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly api = inject(ApiService);

  private readonly categoriesSignal = signal<Category[]>([]);
  private readonly productsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly selectedCategoryIdSignal = signal<number | null>(null);

  readonly error = this.errorSignal.asReadonly();
  readonly selectedCategoryId = this.selectedCategoryIdSignal.asReadonly();

  private static readonly TTL_MS = 5 * 60_000;
  private readonly loadedAt = signal<number | null>(null);

  readonly loaded = computed(() => this.loadedAt() !== null);

  readonly loading = computed(
    () => this.loadingSignal() && this.loadedAt() === null,
  );

  readonly categories = computed(() =>
    [...this.categoriesSignal()].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    ),
  );

  readonly menuGroups = computed<MenuGroup[]>(() => {
    const products = this.productsSignal();
    return this.categories().map((category) => ({
      category,
      products: products.filter((p) => p.categoryId === category.categoryId),
    }));
  });

  loadMenu(force = false): void {
    if (this.loadingSignal()) return;

    const loadedAt = this.loadedAt();
    const fresh =
      loadedAt !== null && Date.now() - loadedAt < MenuService.TTL_MS;
    if (fresh && !force) return;

    this.loadingSignal.set(true);
    if (loadedAt === null) this.errorSignal.set(null);

    this.api.get<MenuCategoryResponse[]>('/Menu').subscribe({
      next: (menu) => {
        const categories = menu.map(({ products, ...category }) => category);
        const products = menu.flatMap((section) => section.products);

        this.categoriesSignal.set(categories);
        this.productsSignal.set(products);

        const selected = this.selectedCategoryIdSignal();
        const stillExists = categories.some((c) => c.categoryId === selected);

        if (categories.length && (!selected || !stillExists)) {
          this.selectedCategoryIdSignal.set(categories[0].categoryId);
        }

        this.loadedAt.set(Date.now());
        this.loadingSignal.set(false);
      },
      error: () => {
        if (this.loadedAt() === null) this.errorSignal.set('menu.error');
        this.loadingSignal.set(false);
      },
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategoryIdSignal.set(categoryId);
  }
}
