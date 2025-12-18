import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { ICreateManualTransactionBody, ICreateTransactionBody } from "@/types/cashierTypes";
import { isAxiosError } from "axios";

const { base, manual, product, discount } = endpoint.cashier;

export interface IParamSearchProduct {
  outletId: string;
  name: string;
}

export const searchProducts = async ({ outletId, name }: IParamSearchProduct) => {
  try {
    const res = await API.get(`${product}?outlet_id=${outletId}&name=${name}`);
    const result = {
      status: res.status,
      message: res.data.message,
      data: res.data.data,
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

export const getProductById = async (productId: string, outletId: string) => {
  try {
    const res = await API.get(`${product}/${outletId}/${productId}`);
    const result = {
      status: res.status,
      message: res.data.message,
      data: res.data.data,
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

export const getDiscount = async (code: string, outlet_id: number) => {
  try {
    const res = await API.post(`${discount}`, { code, outlet_id });
    const result = {
      status: res.status,
      message: res.data.message,
      data: res.data.data,
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

export const createTransaction = async (body: ICreateTransactionBody) => {
  try {
    const res = await API.post(`${base}`, body);
    const result = {
      status: res.status,
      message: res.data.message,
      data: res.data.data,
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

export const createManualTransaction = async (body: ICreateManualTransactionBody) => {
  try {
    const res = await API.post(`${manual}`, body);
    const result = {
      status: res.status,
      message: res.data.message,
      data: res.data.data,
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
