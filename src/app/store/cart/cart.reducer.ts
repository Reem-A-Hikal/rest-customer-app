import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart.state';
import { CartActions } from './cart.actions';
import { MAX_QUANTITY_PER_ITEM } from '../../shared/constants/cart.constants';

const clampQuantity = (quantity: number): number =>
  Math.min(quantity, MAX_QUANTITY_PER_ITEM);

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.addItem, (state, { item, quantity }): CartState => {
    const exists = state.items.some((i) => i.productId === item.productId);

    if (exists) {
      return {
        items: state.items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: clampQuantity(i.quantity + quantity) }
            : i,
        ),
      };
    }

    return {
      items: [...state.items, { ...item, quantity: clampQuantity(quantity) }],
    };
  }),

  on(
    CartActions.incrementQuantity,
    (state, { productId }): CartState => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? { ...i, quantity: clampQuantity(i.quantity + 1) }
          : i,
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
      items: action.items.map((i) => ({
        ...i,
        quantity: clampQuantity(i.quantity),
      })),
    }),
  ),
);
