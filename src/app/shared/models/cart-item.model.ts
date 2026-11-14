export interface CartItem {
  productId: number;
  categoryId?: number | null;
  name: string;
  nameAr?: string | null;
  price: number;
  discountedPrice: number;
  imageUrl: string | null;
  quantity: number;
}
