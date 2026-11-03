export interface OrderTotals {
  subtotal: number;
  delivery: number;
  total: number;
}

export function calculateOrderTotals(
  subtotal: number,
  deliveryFee: number,
): OrderTotals {
  const delivery = subtotal > 0 ? deliveryFee : 0;

  return {
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}
