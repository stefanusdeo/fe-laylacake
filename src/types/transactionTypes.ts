export type TTransactionData = {
  id: number;
  code: string;
  time: string; // format jam seperti "15:47"
  outlet_name: string;
  price: number;
  payment_method: string;
  staff_name: string;
};

export type TransactionsResponse = {
  data: TTransactionData[];
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
  created_at: string;
  status: number;
  time: string;
  discount_nominal: number;
  discount_percentage: number;
  total_discount: number;
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
  npwp: string;
}

export interface IPaymentMethod {
  id: number;
  name: string;
}

export interface IMigrateTransactionBody {
  start_date: string;
  end_date: string;
  from_outlet: number;
  to_outlet: number;
  payment_method: number;
}

export interface IParamTransaction {
  start_date?: string;
  end_date?: string;
  limit: number;
  page: number;
  outlet_id?: number;
  payment_method?: string;
  type?: string;
  only_id?: boolean;
}

export interface IDeleteMultiTransaction {
  type: "all" | "partial"; // 'all' untuk semua, 'partial' untuk yang dipilih
  trx_ids?: number[]; // wajib jika type === 'partial'
  filters: {
    type_trx?: number; // optional: 1 (otomatis), 2 (manual)
    start_date: string; // format: YYYY-MM-DD, required
    end_date: string; // format: YYYY-MM-DD, required
    outlet_id?: number; // optional
    payment_method?: number; // optional
  };
}

export interface IManualTransactionDetail {
  id: number;
  code: string;
  created_at: string;
  time: string;
  discount: number;
  total_price: number;
  money_change: number;
  pay: number;
  transaction_items: ITransactionItem[];
  staff: IStaff;
  outlet: IOutlet;
  payment_method: IPaymentMethod;
}
