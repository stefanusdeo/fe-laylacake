import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { globalError } from "@/utils/globalErrorAxios";
import { IParamsPayment } from "@/types/paymentTypes";
import { usePaymentStore } from "../hooks/usePayment";

const { external, internal, multiDelete } = endpoint.payment_method;

export const migratePayment = async (paymentId: string[] | number[]) => {
  try {
    const body = {
      payment_method_ids: paymentId,
    };
    const response = await API.post(internal, body);
    const result = response.data;
    const resp = {
      status: response.status,
      message: result.message,
      data: null,
    };
    return resp;
  } catch (error) {
    globalError(error);
  }
};

export const getPaymentExternal = async (params: IParamsPayment) => {
  const { search, page, limit, filter } = params;

  const queryParams: Record<string, any> = {
    page,
    limit,
  };

  if (search && filter) {
    queryParams[filter] = search;
  }

  try {
    const response = await API.get(external, { params: queryParams });
    const result = response.data;
    usePaymentStore.getState().setPaymentExternal(result);
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const getPaymentInternal = async (params: IParamsPayment) => {
  const { search, page, limit, filter } = params;

  const queryParams: Record<string, any> = {
    page,
    limit,
  };
  if (search && filter) {
    queryParams[filter] = search;
  }
  try {
    const response = await API.get(internal, { params: queryParams });
    const result = response.data;
    usePaymentStore.getState().setPaymentInternal(result);
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const deletedSpesificPaymentMethod = async (paymentMethodId: number) => {
  try {
    const response = await API.delete(`${internal}/${paymentMethodId}`);
    const result = {
      status: response.status,
      message: response.data.message,
      data: null,
    };
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const deletedMultiplePaymentMethods = async (paymentMethodId: number[], type: string) => {
  try {
    const body = {
      type,
      outlet_ids: paymentMethodId,
    };
    const response = await API.post(multiDelete, body);
    const result = {
      status: response.status,
      message: response.data.message,
      data: null,
    };
    console.log(result);
    return result;
  } catch (error) {
    globalError(error);
  }
};
