import { CartItem } from '../../../shared/models/cart-item.model';
import { Product } from '../../menu/models/menu.model';

export function toCartItem(product: Product): Omit<CartItem, 'quantity'> {
  return {
    productId: product.productId,
    name: product.name,
    nameAr: product.nameAr ?? null,
    price: product.price,
    discountedPrice: product.discountedPrice,
    imageUrl: product.imageUrl,
  };
}
