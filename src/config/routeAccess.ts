export const routeRolePermissions: Record<string, string[]> = {
  "/payment-method": ["Admin", "Super Admin"],
  "/store/outlets": ["Admin", "Super Admin"],
  "/user-management/user-list": ["Admin", "Super Admin"],
  "/user-management/create-user": ["Admin", "Super Admin"],
  "/user-management/edit-user": ["Admin", "Super Admin"],
  "/cashier": ["Kasir", "Admin", "Super Admin"],
  "/transaction": ["Kasir", "Admin", "Super Admin"],
  "/transaction/detail": ["Kasir", "Admin", "Super Admin"],
  "/account": ["Kasir", "Admin", "Super Admin"],
};

export const publicRoutes = ["/", "/login", "/403", "/404"];