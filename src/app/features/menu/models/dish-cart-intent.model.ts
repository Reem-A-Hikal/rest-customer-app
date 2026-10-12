import { Product } from './menu.model';

export type DishCartIntent =
  | { type: 'add'; product: Product }
  | { type: 'increment'; productId: number }
  | { type: 'decrement'; productId: number };
