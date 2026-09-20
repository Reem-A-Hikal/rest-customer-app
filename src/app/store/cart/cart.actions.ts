import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CartItem } from '../../shared/models/cart-item.model';

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Add Item': props<{ item: Omit<CartItem, 'quantity'>; quantity: number }>(),
    'Increment Quantity': props<{ productId: number }>(),
    'Decrement Quantity': props<{ productId: number }>(),
    'Remove Item': props<{ productId: number }>(),
    'Clear Cart': emptyProps(),
    'Load Cart From Storage': emptyProps(),
    'Cart Loaded': props<{ items: CartItem[] }>(),
  },
});
