export interface CreateOrderRequest {
  deliveryAddressId: number;
  customerNotes?: string;
  orderDetails: { productId: number; quantity: number }[];
}

export interface PlacedOrder {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
}
