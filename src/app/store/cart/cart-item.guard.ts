import { CartItem } from '../../shared/models/cart-item.model';

const isOptionalString = (value: unknown): boolean =>
  value === undefined || value === null || typeof value === 'string';

const isNonNegativeNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Record<string, unknown>;
  return (
    Number.isInteger(item['productId']) &&
    (item['productId'] as number) > 0 &&
    typeof item['name'] === 'string' &&
    isOptionalString(item['nameAr']) &&
    isNonNegativeNumber(item['price']) &&
    isNonNegativeNumber(item['discountedPrice']) &&
    isOptionalString(item['imageUrl']) &&
    Number.isInteger(item['quantity']) &&
    (item['quantity'] as number) > 0
  );
}
