export interface CartItem {
  productId: number;
  name: string;
  price: number;
  discountedPrice: number;
  imageUrl: string | null;
  quantity: number;
}
