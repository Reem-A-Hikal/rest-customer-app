import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart.state';
import { CartActions } from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.addItem, (state, { item, quantity }): CartState => {
    const exists = state.items.some((i) => i.productId === item.productId);

    if (exists) {
      return {
        items: state.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        ),
      };
    }

    return {
      items: [...state.items, { ...item, quantity }],
    };
  }),

  on(
    CartActions.incrementQuantity,
    (state, { productId }): CartState => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    }),
  ),

  on(CartActions.decrementQuantity, (state, { productId }): CartState => {
    const current = state.items.find((i) => i.productId === productId);

    if (current && current.quantity > 1) {
      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      };
    }

    return {
      items: state.items.filter((i) => i.productId !== productId),
    };
  }),

  on(
    CartActions.removeItem,
    (state, { productId }): CartState => ({
      items: state.items.filter((i) => i.productId !== productId),
    }),
  ),

  on(
    CartActions.clearCart,
    (): CartState => ({
      items: [],
    }),
  ),

  on(
    CartActions.cartLoaded,
    (_, action): CartState => ({
      items: action.items,
    }),
  ),
);
