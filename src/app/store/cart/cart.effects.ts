import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CartActions } from './cart.actions';
import { map, tap, withLatestFrom } from 'rxjs';
import { selectCartItems } from './cart.selectors';
import { CartItem } from '../../shared/models/cart-item.model';
import { isCartItem } from './cart-item.guard';

const STORAGE_KEY = 'cart';

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Ignoring invalid cart data in localStorage.');
      return [];
    }

    const items = parsed.filter(isCartItem);
    if (items.length !== parsed.length) {
      console.warn('Ignoring invalid cart items in localStorage.');
    }
    return items;
  } catch (error) {
    console.error('Failed to read cart data from localStorage.', error);
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
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          } catch (error) {
            console.error('Failed to save cart data to localStorage.', error);
          }
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
