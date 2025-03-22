import { env } from "process";

export const endpoint = {
  auth: {
    login: "/auth/login",
    refreshToken: "/auth/refresh",
  },
  profile: "/profile",
  outlite: {
    external: "/external/outlets",
    internal: "/internal/outlets",
    migrate: "/internal/outlets",
  },
  user_management: {
    role: "/roles",
    user: "/users",
  },
};

export const environment = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
};
