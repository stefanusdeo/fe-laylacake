export interface OutletData {
  id: number;
  name: string;
  address: string;
  phone_number: string;
}
export type OutletsResponse = {
  data: OutletData[];
  message: string;
  pagination: {
    total_records: number;
    total_page: number;
    next: number;
    previous: number;
  };
};

export interface IParamsOutlet {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
}
