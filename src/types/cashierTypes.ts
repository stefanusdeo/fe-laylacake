export interface ICartItem {
  product_id: number;
  quantity: number;
  discount_code?: string; // optional
}

export interface IProductItems {
  id: number;
  unique_id: string;
  code: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}
