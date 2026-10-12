export enum CategoryStatus {
  Active = 0,
  Inactive = 1,
  Archived = 2,
}

export enum ProductStatus {
  Available = 0,
  Unavailable = 1,
  Archived = 2,
}

export interface Category {
  categoryId: number;
  name: string;
  status: CategoryStatus;
  totalItems: number;
  displayOrder: number;
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  preparationTime: number;
  calories: number | null;
  status: ProductStatus;
  isPromoted: boolean;
  discountPercent: number;
  discountedPrice: number;
  allowedDiscountPercent: number;
  categoryId: number;
}

export interface MenuGroup {
  category: Category;
  products: Product[];
}