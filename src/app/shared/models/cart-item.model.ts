export interface CartItem {
  productId: number;
  name: string;
  nameAr?: string | null;
  price: number;
  discountedPrice: number;
  imageUrl: string | null;
  quantity: number;
}
