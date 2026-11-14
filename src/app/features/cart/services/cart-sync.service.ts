import { effect, inject, Injectable, signal, untracked } from '@angular/core';
import { MenuService } from '../../menu/services/menu.service';
import { CartFacade } from './cart.facade';
import { CartChange, syncCartWithMenu } from '../utils/sync-cart';

@Injectable({
  providedIn: 'root',
})
export class CartSyncService {
  private readonly menu = inject(MenuService);
  private readonly cart = inject(CartFacade);

  private readonly changesState = signal<CartChange[]>([]);
  readonly changes = this.changesState.asReadonly();

  constructor() {
    effect(() => {
      const items = this.cart.items();
      if (!items.length) return;

      if (!this.menu.loaded()) {
        untracked(() => this.menu.loadMenu());
        return;
      }

      const groups = this.menu.menuGroups();
      if (!groups.some((g) => g.products.length)) return;
      const result = syncCartWithMenu(items, this.menu.menuGroups());
      if (!result.dirty) return;

      untracked(() => {
        this.cart.replaceItems(result.items);
        if (result.changes.length) {
          this.changesState.update((prev) => this.merge(prev, result.changes));
        }
      });
    });
  }

  dismiss(): void {
    this.changesState.set([]);
  }

  private merge(prev: CartChange[], next: CartChange[]): CartChange[] {
    const byKey = new Map(prev.map((c) => [`${c.type}:${c.productId}`, c]));
    for (const c of next) byKey.set(`${c.type}:${c.productId}`, c);
    return [...byKey.values()];
  }
}
