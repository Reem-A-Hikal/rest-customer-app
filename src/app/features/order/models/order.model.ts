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

export enum OrderStatus {
  New = 0,
  Confirmed = 1,
  Preparing = 2,
  Ready = 3,
  OutForDelivery = 4,
  Delivered = 5,
  Cancelled = 6,
}

export const CUSTOMER_CANCELLABLE: readonly OrderStatus[] = [
  OrderStatus.New,
  OrderStatus.Confirmed,
];

export interface OrderItem {
  productId: number;
  productName: string;
  productNameAr?: string | null;
  productImageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  estimatedDeliveryTime?: number | null;
  customerAddress?: string | null;
  customerNotes?: string | null;
  orderDetails: OrderItem[];
}
