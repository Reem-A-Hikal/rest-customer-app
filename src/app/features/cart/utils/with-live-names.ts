import { CartItem } from '../../../shared/models/cart-item.model';
import { MenuGroup } from '../../menu/models/menu.model';

export function withLiveNames(
  items: CartItem[],
  groups: MenuGroup[],
): CartItem[] {
  const arabicById = new Map<number, string | null>();

  for (const group of groups) {
    for (const product of group.products) {
      arabicById.set(product.productId, product.nameAr ?? null);
    }
  }

  return items.map((item) => {
    const live = arabicById.get(item.productId);
    return live === undefined ? item : { ...item, nameAr: live };
  });
}
