import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Category, MenuGroup, Product } from '../models/menu.model';
import { forkJoin } from 'rxjs';
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

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedCategoryId = this.selectedCategoryIdSignal.asReadonly();

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

  loadMenu(): void {
    if (this.categoriesSignal().length || this.loadingSignal()) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      categories: this.api.get<Category[]>(`/Category/all`),
      products: this.api.get<Product[]>(`/Product/all`),
    }).subscribe({
      next: ({ categories, products }) => {
        this.categoriesSignal.set(categories);
        this.productsSignal.set(products);
        if (categories.length && !this.selectedCategoryIdSignal()) {
          this.selectedCategoryIdSignal.set(categories[0].categoryId);
        }
        this.loadingSignal.set(false);
      },
      error: () => {
        this.errorSignal.set('menu.error');
        this.loadingSignal.set(false);
      },
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategoryIdSignal.set(categoryId);
  }
}
