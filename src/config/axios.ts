import { environment } from "@/constant/endpoint";
import axios from "axios";

const baseURL = environment.baseUrl;

export const API = axios.create({
  baseURL,
  withCredentials: true,
});
