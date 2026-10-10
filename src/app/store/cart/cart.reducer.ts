import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart.state';
import { CartActions } from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  on(CartActions.addItem, (state, action): CartState => {
    const existingItem = state.items.some(
      (item) => item.productId === action.item.productId,
    );

    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.productId === action.item.productId
            ? { ...item, quantity: item.quantity + action.quantity }
            : item,
        ),
      };
    }

    return {
      items: [...state.items, { ...action.item, quantity: action.quantity }],
    };
  }),

  on(
    CartActions.incrementQuantity,
    (state, action): CartState => ({
      items: state.items.map((i) =>
        i.productId === action.productId
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    }),
  ),

  on(CartActions.decrementQuantity, (state, action): CartState => {
    const item = state.items.find((i) => i.productId === action.productId);

    if (item && item.quantity > 1) {
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    }

    return {
      items: state.items.filter((item) => item.productId !== action.productId),
    };
  }),

  on(
    CartActions.removeItem,
    (state, action): CartState => ({
      items: state.items.filter((item) => item.productId !== action.productId),
    }),
  ),

  on(
    CartActions.clearCart,
    (): CartState => ({
      items: [],
    }),
  ),

  on(CartActions.loadCartFromStorage, (state): CartState => state),

  on(
    CartActions.cartLoaded,
    (action): CartState => ({
      items: action.items,
    }),
  ),
);
