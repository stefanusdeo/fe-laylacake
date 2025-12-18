// actions/auth.ts
import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { isAxiosError } from "axios";
import Cookie from "js-cookie";
import { useAuthStore } from "../hooks/useAuth";
import { useProfileStore } from "../hooks/useProfile";
import { useUserStore } from "../hooks/useUsers";

export const loginAccount = async (email: string, password: string) => {
  try {
    // Reset state awal
    useUserStore.getState().resetUser();
    useProfileStore.getState().resetProfile();

    const { data: result } = await API.post(endpoint.auth.login, {
      email,
      password,
    });

    if (result?.data && result.message === "success") {
      const { access_token, refresh_token } = result.data;
      Cookie.set("access_token", access_token);
      API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      useAuthStore.getState().setAuth(access_token, refresh_token);
    }

    return result;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
    return { message: "Unexpected error", error };
  }
};

export const logoutAccount = async () => {
  useAuthStore.getState().logout();
  useUserStore.getState().resetUser();
  useProfileStore.getState().resetProfile();
  Cookie.remove("access_token");
  Cookie.remove("role");
  Cookie.remove("tiketId")
  delete API.defaults.headers.common["Authorization"];
};

export const refreshTokenAccount = async () => {
  const refresh_token = useAuthStore.getState().refreshToken;
  try {
    const { data: result } = await API.post(endpoint.auth.refreshToken, {
      refresh_token,
    });

    const { access_token, refresh_token: newRefresh } = result.data;
    Cookie.set("access_token", access_token);
    API.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    useAuthStore.getState().setAuth(access_token, newRefresh);

    return result.message;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return errorResponse;
    } else {
      return error;
    }
  }
};
