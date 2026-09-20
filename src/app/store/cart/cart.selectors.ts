import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items,
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0,
  ),
);

export const selectItemQuantity = (productId: number) =>
  createSelector(selectCartItems, (items) => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  });
