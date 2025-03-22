export interface Role {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Outlet {
  id: number;
  name: string;
  alamat: string;
  no_hp: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserOutlet {
  id: number;
  user_id: number;
  outlet_id: number;
  created_at: string | null;
  updated_at: string | null;
  outlet: Outlet;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  no_hp: string;
  created_at: string | null;
  updated_at: string;
  role_id: number;
  is_active: number;
  role: Role;
  outlets: UserOutlet[];
}
