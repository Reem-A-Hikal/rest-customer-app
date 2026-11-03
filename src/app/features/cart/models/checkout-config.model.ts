export interface CheckoutConfig {
  deliveryFee: number;
  acceptingOrders: boolean;
  orderWindow: { opensAt: string; closesAt: string };
  deliveryEstimate: { minMinutes: number; maxMinutes: number };
}
