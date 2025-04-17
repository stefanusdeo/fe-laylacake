import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import {
  IDeleteMultiTransaction,
  IMigrateTransactionBody,
  IParamTransaction,
} from "@/types/transactionTypes";
import { globalError } from "@/utils/globalErrorAxios";
import { useTransactionStore } from "../hooks/useTransactions";
import { format } from "date-fns";

const { base, migrate, multiDelete, print } = endpoint.transactions;

export const getListTransactions = async (params: IParamTransaction) => {
  const {
    start_date = "2025-01-01",
    end_date = new Date(),
    limit,
    page,
    outlet_id,
    payment_method,
    type,
  } = params;

  const queryParams: Record<string, any> = {
    start_date: format(start_date, "yyyy-MM-dd"),
    end_date: format(end_date, "yyyy-MM-dd"),
    limit,
    page,
    outlet_id,
    payment_method,
    type,
  };

  if (outlet_id === undefined) {
    delete queryParams.outlet_id;
  }
  if (payment_method === undefined) {
    delete queryParams.payment_method;
  }
  if (type === undefined) {
    delete queryParams.type;
  }

  try {
    const response = await API.get(base, { params: queryParams });
    const result = response.data;
    useTransactionStore.getState().setTransactions(result);
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const getDetailTrx = async (trxId: number) => {
  try {
    const response = await API.get(`${base}/${trxId}`);
    const result = {
      status: response.status,
      message: response.data.message,
      data: response.data.data,
    };
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const migrateTransactions = async (body: IMigrateTransactionBody) => {
  const requestBody = {
    ...body,
    start_date: format(body.start_date, "yyyy-MM-dd"),
    end_date: format(body.end_date, "yyyy-MM-dd"),
  };
  try {
    const response = await API.post(migrate, requestBody);
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

export const delTransaction = async (trxId: number) => {
  try {
    const response = await API.delete(`${base}/${trxId}`);
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

export const deleteMultiTrx = async (body: IDeleteMultiTransaction) => {
  try {
    const response = await API.post(multiDelete, body);
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

export const printTransaction = async (trxId: number) => {
  try {
    const response = await API.get(`${print}/${trxId}`);
    const result = response.data;
    return result;
  } catch (error) {
    globalError(error);
  }
};
