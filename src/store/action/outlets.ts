import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { useOutletStore } from "../hooks/useOutlets";
import { globalError } from "@/utils/globalErrorAxios";
import { IParamsOutlet } from "@/types/outletTypes";

const { external, internal, multiDelete } = endpoint.outlet;

export const migrateOutlets = async (outlietId: string[] | number[]) => {
  try {
    const body = {
      outlet_ids: outlietId,
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

export const getOutletsExternal = async (params: IParamsOutlet) => {
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
    useOutletStore.getState().setOutletExternal(result);
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const getOutletsInternal = async (params: IParamsOutlet) => {
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
    useOutletStore.getState().setOutletInternal(result);
    return result;
  } catch (error) {
    globalError(error);
  }
};

export const deletedSpesificOutlets = async (outletId: number) => {
  try {
    const response = await API.delete(`${internal}/${outletId}`);
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

export const deletedMultipleOutlets = async (outletId: number[], type: string) => {
  try {
    const body = {
      type,
      outlet_ids: outletId,
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
