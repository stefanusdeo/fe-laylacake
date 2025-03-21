import { API } from "@/config/axios";
import { endpoint } from "@/constant/endpoint";

const { login, refreshToken } = endpoint.auth;

export const loginAccount = async(email: string, password: string) => {
  const body = {
    email,
    password,
  };

  try {
    const response = await API.post(login, body);
    const result = response.data
    console.log("result: ",result)
    return result;
  } catch (error) {
    console.log(error);
  }
};
