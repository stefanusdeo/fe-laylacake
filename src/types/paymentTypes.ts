export interface PaymentMethodData {
  id: number;
  name: string;
}
export type PaymentMethodResponse = {
  data: PaymentMethodData[];
  message: string;
  pagination: {
    total_records: number;
    total_page: number;
    next: number;
    previous: number;
  };
};

export interface IParamsPayment {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
}
