export type Transaction = {
  id: number;
  code: string;
  time: string; // format jam seperti "15:47"
  outlet_name: string;
  price: number;
  payment_method: string;
  staff_name: string;
};

export type TransactionsResponse = {
  data: Transaction[];
  message: string;
  pagination: {
    total_records: number;
    total_page: number;
    next: number;
    previous: number;
  };
};

export interface ITransactionDetail {
  id: number;
  code: string;
  created_at: string; // ISO format date
  status: number;
  time: string; // HH:mm format
  discount: number;
  total_price: number;
  money_change: number;
  pay: number;
  transaction_items: ITransactionItem[];
  staff: IStaff;
  outlet: IOutlet;
  payment_method: IPaymentMethod;
}

export interface ITransactionItem {
  code_item: string;
  item_name: string;
  price: number;
  quantity: number;
  discount_code: string;
  quantity_discount: number;
  discount_percentage: number;
  discount_nominal: number;
  sub_total: number;
}

export interface IStaff {
  id: number;
  email: string;
  name: string;
  phone_number: string;
}

export interface IOutlet {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  migration_id: number;
}

export interface IPaymentMethod {
  id: number;
  name: string;
}

export interface IMigrateTransactionBody {
  start_date: string;
  end_date: string;
  outlet_id: number;
  payment_method: number;
}

export interface IParamTransaction {
  start_date?: string;
  end_date?: string;
  limit: number;
  page: number;
  outlet_id?: number ;
  payment_method?: string;
  type?: string;
}
