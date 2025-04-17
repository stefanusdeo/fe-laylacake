
export const endpoint = {
  auth: {
    login: "/auth/login",
    refreshToken: "/auth/refresh",
  },
  profile: "/profile",
  password: "/password",
  permission: "/permissions",
  outlet: {
    external: "/external/outlets",
    internal: "/internal/outlets",
    migrate: "/internal/outlets",
    multiDelete: "/internal/outlets/delete-bulk",
  },
  user_management: {
    role: "/roles",
    user: "/users",
    deleteAll: "/users/delete-bulk",
  },
  payment_method: {
    external: "/external/payment-methods",
    internal: "/internal/payment-methods",
    migrate: "/internal/payment-methods",
    multiDelete: "/internal/payment-methods/delete-bulk",
  },
  transactions: {
    base: "/transactions",
    migrate: "/transactions/migrate",
    multiDelete: "/transactions/delete-bulk",
    print: "/transactions/print",
    create_manual: "/transactions-manual",
  },
};

export const environment = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
};
