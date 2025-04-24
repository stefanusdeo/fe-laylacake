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
export interface IDiscountItem {
  id: number;
  code: string;
  name: string;
  nominal: number;
  percentage: number;
  outlet_id: number;
  quantity: number;
}

export interface ICreateTransactionBody {
  outlet_id: number;
  payment_method: number;
  carts: ICartItem[];
  discount_code?: string;
  pay: number;
}
export interface ICustomProduct {
  name: string;
  price: number;
  quantity: number;
}

export interface ICreateManualTransactionBody {
  outlet_id: number;
  payment_method: number;
  product: ICustomProduct;
  pay: number;
}