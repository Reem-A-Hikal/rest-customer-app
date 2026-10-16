export const DELIVERY_FEE = 50;

export interface OrderTotals {
  subtotal: number;
  delivery: number;
  total: number;
}

export function calculateOrderTotals(subtotal: number): OrderTotals {
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;

  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}
