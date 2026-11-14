import { CartItem } from '../../../shared/models/cart-item.model';
import {
  MenuGroup,
  Product,
  ProductStatus,
} from '../../menu/models/menu.model';

export interface CartChange {
  type: 'removed' | 'priceChanged';
  productId: number;
  categoryId?: number | null;
  name: string;
  nameAr?: string | null;
  from?: number;
  to?: number;
}

export interface CartSyncResult {
  items: CartItem[];
  changes: CartChange[];
  dirty: boolean;
}

const EPSILON = 0.005;
const differs = (a: number, b: number) => Math.abs(a - b) > EPSILON;

function refreshed(item: CartItem, product: Product): CartItem {
  return {
    ...item,
    name: product.name,
    nameAr: product.nameAr ?? null,
    categoryId: product.categoryId,
    price: product.price,
    discountedPrice: product.discountedPrice,
    imageUrl: product.imageUrl,
  };
}

function isStale(item: CartItem, fresh: CartItem): boolean {
  return (
    item.name !== fresh.name ||
    (item.nameAr ?? null) !== (fresh.nameAr ?? null) ||
    (item.categoryId ?? null) !== (fresh.categoryId ?? null) ||
    (item.imageUrl ?? null) !== (fresh.imageUrl ?? null) ||
    differs(item.price, fresh.price) ||
    differs(item.discountedPrice, fresh.discountedPrice)
  );
}

export function syncCartWithMenu(
  items: CartItem[],
  groups: MenuGroup[],
): CartSyncResult {
  const live = new Map<number, Product>();
  for (const group of groups) {
    for (const p of group.products) {
      if (p.status === ProductStatus.Available) live.set(p.productId, p);
    }
  }

  const next: CartItem[] = [];
  const changes: CartChange[] = [];
  let dirty = false;

  for (const item of items) {
    const product = live.get(item.productId);

    if (!product) {
      changes.push({
        type: 'removed',
        productId: item.productId,
        name: item.name,
        nameAr: item.nameAr,
        categoryId: item.categoryId ?? null,
      });
      dirty = true;
      continue;
    }

    const fresh = refreshed(item, product);

    if (!isStale(item, fresh)) {
      next.push(item);
      continue;
    }

    dirty = true;

    if (differs(item.discountedPrice, fresh.discountedPrice)) {
      changes.push({
        type: 'priceChanged',
        productId: item.productId,
        name: fresh.name,
        nameAr: fresh.nameAr ?? null,
        from: item.discountedPrice,
        to: fresh.discountedPrice,
      });
    }

    next.push(fresh);
  }

  return { items: next, changes, dirty };
}
