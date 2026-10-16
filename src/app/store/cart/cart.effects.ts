import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CartActions } from './cart.actions';
import { map, tap, withLatestFrom } from 'rxjs';
import { selectCartItems } from './cart.selectors';
import { CartItem } from '../../shared/models/cart-item.model';

const STORAGE_kEY = 'cart';

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_kEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}
@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  persistCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addItem,
          CartActions.incrementQuantity,
          CartActions.decrementQuantity,
          CartActions.removeItem,
          CartActions.clearCart,
        ),
        withLatestFrom(this.store.select(selectCartItems)),
        tap(([_, items]) => {
          localStorage.setItem(STORAGE_kEY, JSON.stringify(items));
        }),
      ),
    { dispatch: false },
  );

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCartFromStorage),
      map(() => CartActions.cartLoaded({ items: readStoredCart() })),
    ),
  );
}
