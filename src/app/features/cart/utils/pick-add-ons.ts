import { CartItem } from '../../../shared/models/cart-item.model';
import {
  MenuGroup,
  Product,
  ProductStatus,
} from '../../menu/models/menu.model';

export const ADD_ON_CATEGORY = /^(dessert|beverage)/i;

export type AddOnProduct = Omit<CartItem, 'quantity'>;

export function pickAddOns(
  groubs: MenuGroup[],
  cartItems: CartItem[],
  limit = 2,
): AddOnProduct[] {
  const inCart = new Set(cartItems.map((item) => item.productId));

  return groubs
    .filter(({ category }) => ADD_ON_CATEGORY.test(category.name))
    .map(({ products }) =>
      products.find(
        (p) => p.status === ProductStatus.Available && !inCart.has(p.productId),
      ),
    )
    .filter((p): p is Product => p !== undefined)
    .slice(0, limit)
    .map(({ productId, name, price, discountedPrice, imageUrl }) => ({
      productId,
      name,
      price,
      discountedPrice,
      imageUrl: imageUrl ?? null,
    }));
}
