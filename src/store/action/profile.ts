import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
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
    useProfileStore.getState().setProfile(result);
    return result;
  } catch (error) {
    return error;
  }
};

export const updateProfile = async (body: BodyProfile) => {
  try {
    const response = await API.put(profile, body);
    const result = response.data?.data;
    useProfileStore.getState().setProfile(result);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (body: any) => {
  try {
    const response = await API.put(password, body);
    const result = response.data;
    console.log(result)
    return result;
  } catch (error) {
    return error;
  }
};
