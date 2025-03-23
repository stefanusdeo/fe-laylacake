import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";
import { useAuthStore } from "../hooks/useAuth";
import Cookie from "js-cookie";

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
    // const result = {
    //   status: 200,
    //   data: {
    //     access_token:
    //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhY2hydWxtdXN0b2ZhLmRldkBnbWFpbC5jb20iLCJleHAiOjE3NDIzODg4MzksImlhdCI6MTc0MjM4NzkzOSwiaWQiOjEsInJvbGVfaWQiOjF9.ODUwA47vC-Uan_gFtxh4FymdrdzDzDeWSFVYsg2r32k",
    //     refresh_token:
    //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDI0NzQzMzksInRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkltWmhZMmh5ZFd4dGRYTjBiMlpoTG1SbGRrQm5iV0ZwYkM1amIyMGlMQ0psZUhBaU9qRTNOREl6T0RnNE16a3NJbWxoZENJNk1UYzBNak00Tnprek9Td2lhV1FpT2pFc0luSnZiR1ZmYVdRaU9qRjkuT0RVd0E0N3ZDLVVhbl9nRnR4aDRGeW1kcmR6RHpEZVdTRlZZc2cycjMyayJ9.sYQJ9as6bDOddYXyfnDFAoxecNSwGW2GYefZhn5NaG8",
    //   },
    //   message: "success",
    // };
    const result = response.data;
    if (result.data && result.message === "success") {
      const { access_token, refresh_token } = result.data;
      Cookie.set("access_token", access_token);
      useAuthStore.getState().setAuth(access_token, refresh_token);
    }
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
