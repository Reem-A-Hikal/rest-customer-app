import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  selectCartCount,
  selectCartDiscount,
  selectCartItems,
  selectCartSubtotal,
} from '../../../store/cart/cart.selectors';
import { CartItem } from '../../../shared/models/cart-item.model';
import { CartActions } from '../../../store/cart/cart.actions';

@Injectable({
  providedIn: 'root',
})
export class CartFacade {
  private readonly store = inject(Store);

  readonly items = toSignal(this.store.select(selectCartItems), {
    initialValue: [] as CartItem[],
  });

  readonly count = toSignal(this.store.select(selectCartCount), {
    initialValue: 0,
  });

  readonly subtotal = toSignal(this.store.select(selectCartSubtotal), {
    initialValue: 0,
  });

  readonly discount = toSignal(this.store.select(selectCartDiscount), {
    initialValue: 0,
  });

  quantityOf(productId: number): number {
    return (
      this.items().find((item) => item.productId === productId)?.quantity ?? 0
    );
  }

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number): void {
    this.store.dispatch(CartActions.addItem({ item, quantity }));
  }

  increment(productId: number): void {
    this.store.dispatch(CartActions.incrementQuantity({ productId }));
  }

  decrement(productId: number): void {
    this.store.dispatch(CartActions.decrementQuantity({ productId }));
  }

  remove(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  clear(): void {
    this.store.dispatch(CartActions.clearCart());
  }
}
