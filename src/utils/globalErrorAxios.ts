import { isAxiosError } from "axios";

export const globalError = (error: any) => {
  if (isAxiosError(error)) {
    const errorResponse = error.response?.data;
    console.log(errorResponse);
    return errorResponse;
  }
  return error;
};
