export interface IParamUsers {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
}
export interface Role {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface OutletUsers {
  id: number;
  name: string;
}

export interface UserOutlet {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  role_name: string;
  role_id: number;
  status: number;
  outlets: OutletUsers[];
}

export type UsersResponse = {
  data: User[];
  message: string;
  pagination: {
    total_records: number;
    total_page: number;
    next: number;
    previous: number;
  };
};
