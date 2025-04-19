import { isAxiosError } from "axios";

export const globalError = (error: any) => {
  if (isAxiosError(error)) {
    const errorResponse = error.response?.data;
    console.log("erro axios",errorResponse);
    return errorResponse;
  }else{
    console.log("erro não axios",error);
    return error;
  }
};
