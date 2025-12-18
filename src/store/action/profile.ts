import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { isAxiosError } from "axios";
import Cookie from "js-cookie";
import { useProfileStore } from "../hooks/useProfile";

const { profile, password } = endpoint;

export type BodyProfile = {
  name?: string;
  phone_number?: string;
};

export const getProfile = async () => {
  try {
    const response = await API.get(profile);
    const result = response.data?.data;
    Cookie.set("role", result.role_name);
    useProfileStore.getState().setProfile(result);
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

export const updateProfile = async (body: BodyProfile) => {
  try {
    const response = await API.put(profile, body);
    const result = response.data?.data;
    useProfileStore.getState().setProfile(result);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};

export const updatePassword = async (body: any) => {
  try {
    const response = await API.put(password, body);
    const result = response.data;
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
