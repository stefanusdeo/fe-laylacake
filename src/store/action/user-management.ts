import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { IParamUsers } from "@/types/userTypes";
import { isAxiosError } from "axios";
import { useUserStore } from "../hooks/useUsers";

const { user, role, deleteAll, accessOutlet } = endpoint.user_management;

export type UserFormBody = {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  role_id: number; // 1: Superadmin, 2: Admin, 3: Kasir
  outlet_ids?: number[]; // Wajib jika role_id = 3 (Kasir), opsional untuk role lainnya
};

export const getListUsers = async (params: IParamUsers) => {
  const { search, page, limit, filter } = params;

  const queryParams: Record<string, any> = {
    page,
    limit,
  };

  if (search && filter) {
    queryParams[filter] = search;
  }
  try {
    const response = await API.get(user, { params: queryParams });
    const result = response.data;
    useUserStore.getState().setUsers(result);
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const createUsers = async (body: UserFormBody) => {
  try {
    const response = await API.post(user, body);
    const result = {
      status: response.status,
      message: response.data.message,
      data: null,
    };
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const deleteAllUsers = async (userIds: number[], type: string) => {
  try {
    const body = {
      type,
      user_ids: userIds,
    };
    const response = await API.post(deleteAll, body);
    const result = {
      status: response.status,
      message: response.data.message,
      data: null,
    };
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await API.delete(`${user}/${userId}`);
    const result = {
      status: response.status,
      message: response.data.message,
      data: null,
    };
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const getDetailUser = async (userId: number) => {
  try {
    const response = await API.get(`${user}/${userId}`);
    const result = {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const updateUser = async (userId: number, body: UserFormBody) => {
  try {
    const response = await API.put(`${user}/${userId}`, body);
    const result = {
      status: response.status,
      message: response.data.message,
      data: null,
    };
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const getAccessOutlet = async () => {
  try {
    const response = await API.get(accessOutlet);
    const result = {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
    useUserStore.getState().setMyOutlet(result.data);
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};
