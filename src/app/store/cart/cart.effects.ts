import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CartActions } from './cart.actions';
import { map, tap, withLatestFrom } from 'rxjs';
import { selectCartItems } from './cart.selectors';

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
          localStorage.setItem('cart', JSON.stringify(items));
        }),
      ),
    { dispatch: false },
  );

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCartFromStorage),
      map(() => {
        const raw = localStorage.getItem('cart');
        const items = raw ? JSON.parse(raw) : [];
        return CartActions.cartLoaded({ items });
      }),
    ),
  );
}
