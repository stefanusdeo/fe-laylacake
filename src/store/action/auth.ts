import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { useAuthStore } from "../hooks/useAuth";
import Cookie from "js-cookie";
import { isAxiosError } from "axios";
import { globalError } from "@/utils/globalErrorAxios";

const { login, refreshToken } = endpoint.auth;

export const logoutAccount = async () => {
  useAuthStore.getState().logout();
  Cookie.remove("access_token");
};

export const loginAccount = async (email: string, password: string) => {
  const body = {
    email,
    password,
  };

  try {
    const response = await API.post(login, body);
    const result = response.data;

    if (result.data && result.message === "success") {
      const { access_token, refresh_token } = result.data;
      Cookie.set("access_token", access_token);
      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      useAuthStore.getState().setAuth(access_token, refresh_token);
    }
    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      console.log(errorResponse);
      return errorResponse;
    }
    return error;
  }
};

export const refreshTokenAccount = async () => {
  const tokenRefresh = useAuthStore.getState().refreshToken;
  try {
    const response = await API.post(refreshToken, {
      refresh_token: tokenRefresh,
    });
    const result = response.data;
    const { access_token, refresh_token } = result.data;
    Cookie.set("access_token", access_token);
    API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    useAuthStore.getState().setAuth(access_token, refresh_token);
    console.log(result);
    return result.message;
  } catch (error) {
    globalError(error);
  }
};
