import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { IMigrateTransactionBody, IParamTransaction } from "@/types/transactionTypes";
import { globalError } from "@/utils/globalErrorAxios";
import { useTransactionStore } from "../hooks/useTransactions";
import { format } from "date-fns";

const { base, migrate, multiDelete, print, create_manual } = endpoint.transactions;

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
  try {
    const response = await API.post(migrate, body);
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

export const deleteMultiTrx = async (ids: number[]) => {
  try {
    const response = await API.delete(multiDelete, { data: { ids } });
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
